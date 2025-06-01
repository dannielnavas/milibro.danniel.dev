import { GoogleGenAI } from '@google/genai';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBooksDto, UpdateBooksDto } from 'src/books/dto/books.dto';
import { Books } from 'src/books/entities/books.entity';
import { GoogleBooks, Item } from 'src/books/interface/google-books';
import { BookOpenLibraryData } from 'src/books/interface/open-library-data';
import { BookOpenLibraryDetails } from 'src/books/interface/open-library-details';
import config from 'src/config';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  ai = new GoogleGenAI({
    apiKey: 'AIzaSyDYHrI2xZU_lao8GdRXfOAuqg81_nWwbVU',
  });
  constructor(
    @InjectModel(Books.name) private readonly books: Model<Books>,
    private readonly http: HttpService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async create(data: CreateBooksDto) {
    const newBooks = new this.books(data);
    return newBooks.save();
  }

  async findOneByIdLibrary(idLibrary: string) {
    const books = await this.books.find({ library: idLibrary });
    return books;
  }

  async findOneById(id: string) {
    const books = await this.books.findById(id);
    return books;
  }

  async update(id: string, changes: any) {
    const books = this.books
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    return books;
  }

  async searchBookByIsbn(isbn: string) {
    console.log(isbn);
    const [googleBooks, openLibrary, openLibraryDetails] = await Promise.all([
      this.searchBookInGoogleBooks(isbn),
      this.searchBookInOpenLibrary(isbn),
      this.searchBookInOpenLibraryDetails(isbn),
    ]);

    const openLibraryDetailsData = this.generateDataOpenLibraryDetails(
      openLibraryDetails[`ISBN:${isbn}`] as unknown as BookOpenLibraryDetails,
      openLibrary[`ISBN:${isbn}`] as unknown as BookOpenLibraryData,
    );

    let googleBooksData = {};

    if ((googleBooks as unknown as GoogleBooks).totalItems > 0) {
      googleBooksData = this.generateDataGoogleBooks(
        (googleBooks as unknown as GoogleBooks).items[0],
      );
    } else {
      googleBooksData = {};
    }

    return {
      googleBooks: googleBooksData,
      openLibrary: openLibraryDetailsData,
    };
  }

  generateDataGoogleBooks(googleBooks: Item): any {
    if (!googleBooks) {
      return {};
    }

    const standardBook = {
      isbn: googleBooks.volumeInfo.industryIdentifiers,
      title: googleBooks.volumeInfo.title,
      publishedDate: googleBooks.volumeInfo.publishedDate,
      description: googleBooks.volumeInfo.description,
      authors: googleBooks.volumeInfo.authors,
      printType: googleBooks.volumeInfo.printType,
      categories: googleBooks.volumeInfo.categories,
      imageLinks: googleBooks.volumeInfo.imageLinks,
      previewLink: googleBooks.volumeInfo.previewLink,
      infoLink: googleBooks.volumeInfo.infoLink,
      publisher: googleBooks.volumeInfo.publisher,
      language: googleBooks.volumeInfo.language,
      pages: googleBooks.volumeInfo.pageCount,
    };
    return standardBook;
  }

  generateDataOpenLibraryDetails(
    openLibraryDetails: BookOpenLibraryDetails,
    openLibrary: BookOpenLibraryData,
  ): any {
    const data = openLibrary;
    console.log(data);
    const details = openLibraryDetails;
    console.log(details);
    if (!details || !data) return {};
    const standardBook = {
      isbn: details.bib_key.split(':')[1],
      title: data.title,
      publishedDate: details.details.publish_date,
      pages: details.details.number_of_pages,
      authors: [],
      printType: 'BOOK',
      categories: [],
      imageLinks: {
        smallThumbnail: data.cover.large,
        thumbnail: data.cover.large,
      },
      previewLink: details.preview_url,
      infoLink: details.info_url,
      publisher: '',
      language: '',
    };

    if (details.details.publishers) {
      standardBook.publisher = details.details.publishers[0];
    } else {
      standardBook.publisher = '';
    }

    if (data.authors) {
      data.authors.forEach(({ name }) => {
        standardBook.authors.push(name);
      });
    }

    if (details.details.languages) {
      details.details.languages.forEach(({ key }) => {
        switch (key) {
          case '/languages/eng':
            standardBook.language = 'en';
            break;
          case '/languages/spa':
            standardBook.language = 'es';
            break;
          case '/languages/fre':
            standardBook.language = 'fr';
            break;
          default:
            standardBook.language = 'unknown';
            break;
        }
      });
    } else {
      standardBook.language = 'unknown';
    }

    return standardBook;
  }

  async searchBookInGoogleBooks(isbn: string) {
    console.log(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=es&key=${this.configService.apiKeyGoogle}`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=es&key=${this.configService.apiKeyGoogle}`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async searchBookInOpenLibrary(isbn: string) {
    // https://openlibrary.org/api/books?bibkeys=ISBN:978-84-376-0494-7&format=json&jscmd=details
    console.log(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async searchBookInOpenLibraryDetails(isbn: string) {
    // https://openlibrary.org/api/books?bibkeys=ISBN:978-84-376-0494-7&format=json&jscmd=details
    console.log(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=details`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=details`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async searchBookInLibraryThing(isbn: string) {
    //www.librarything.com/api/YOUR_TOKEN/thingISBN/0441172717
    console.log(
      `https://www.librarything.com/api/talpa.php?search==${isbn}&token=${this.configService.apiKeyLibraryThing}`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://www.librarything.com/api/talpa.php?search=${isbn}&token=${this.configService.apiKeyLibraryThing}&responseType=json&searchtype=isbn`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  // search book by title

  async searchBookByTitle(title: string) {
    console.log(title);
    const [googleBooks] = await Promise.all([
      this.searchBookInGoogleBooksByTitle(title),
    ]);
    const data = [];
    (googleBooks as GoogleBooks).items.forEach((item) => {
      data.push(this.generateDataGoogleBooks(item));
    });

    return {
      googleBooks: data,
    };
  }

  async searchBookInGoogleBooksByTitle(title: string) {
    console.log(
      `https://www.googleapis.com/books/v1/volumes?q=${title}&langRestrict=es&key=${this.configService.apiKeyGoogle}`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${title}&langRestrict=es&key=${this.configService.apiKeyGoogle}`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async searchBookInOpenLibraryByTitle(title: string) {
    // https://openlibrary.org/api/books?bibkeys=ISBN:978-84-376-0494-7&format=json&jscmd=details
    console.log(
      `https://openlibrary.org/api/books?bibkeys=${title}&format=json&jscmd=data`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://openlibrary.org/api/books?bibkeys=${title}&format=json&jscmd=data`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async searchBookInOpenLibraryDetailsByTitle(title: string) {
    console.log(
      `https://openlibrary.org/api/books?bibkeys=${title}&format=json&jscmd=details`,
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://openlibrary.org/api/books?bibkeys=${title}&format=json&jscmd=details`,
        )
        .subscribe({
          next: (response) => resolve(response.data),
          error: (err) => reject(err),
        });
    });
  }

  async delete(id: string) {
    const books = await this.books.findById(id);
    console.log(books);
    if (!books) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return await this.books.findByIdAndDelete(id);
  }

  async updatePartial(id: string, changes: UpdateBooksDto) {
    console.log(changes);
    console.log(id);
    const books = await this.books.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true },
    );
    return books;
  }

  async searchAuthors(name: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`https://openlibrary.org/search/authors.json?q=${name}`)
        .subscribe({
          next: (response) => resolve(response.data),
          error: () =>
            reject(new NotFoundException(`Author ${name} not found`)),
        });
    });
  }

  async getPhoto(id: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`https://covers.openlibrary.org/a/olid/${id}-L.jpg`)
        .subscribe({
          next: (response) => resolve(response.data),
          error: () =>
            reject(new NotFoundException(`Photo for author ${id} not found`)),
        });
    });
  }

  async recommendBooks(books: CreateBooksDto[]) {
    if (!books || books.length === 0) {
      // Opción 1: Lanzar un error
      // throw new BadRequestException('Book list cannot be empty to provide recommendations.');
      // Opción 2: Devolver un mensaje específico o una lista de recomendaciones genéricas/populares
      // (esto requeriría un prompt diferente o una lógica separada)
      return 'No se pueden generar recomendaciones sin una lista de libros leídos.';
    }

    const MAX_BOOKS_IN_PROMPT = 50; // Define un límite razonable
    const booksForPrompt =
      books.length > MAX_BOOKS_IN_PROMPT
        ? books.slice(0, MAX_BOOKS_IN_PROMPT)
        : books;
    // Luego usa booksForPrompt para construir el string del prompt
    const bookListString = booksForPrompt
      .map((book) => `${book.title} by ${book.author}`)
      .join(', ');
    // Actualiza el prompt:
    // ... Ejemplo de lista de un usuario:
    // ${bookListString}
    // ${booksForPrompt.length < books.length ? '\n(Nota: La lista de libros ha sido truncada para el análisis.)' : ''}
    // ...

    const content = `Eres un motor de recomendación de libros avanzado para una aplicación de inventario de libros. Tu objetivo es proporcionar a los usuarios recomendaciones personalizadas basadas en su historial de lectura.

    **Entrada:** Recibirás una lista de libros que el usuario ha leído. Ejemplo de lista de un usuario:
    ${bookListString}

    **Tu Tarea:**
    1.  **Analiza exhaustivamente la lista de libros leídos por el usuario.** Identifica géneros (ej. ciencia ficción, fantasía, terror, manga, clásicos de aventura, thriller, etc.), autores recurrentes, subgéneros, temáticas comunes o estilos literarios predominantes.
    2.  **Infiere las preferencias del usuario.** Basándote en el análisis, determina qué tipo de libro podría disfrutar a continuación. Si la lista es diversa, debes identificar y enfocarte en los géneros, autores o temas más fuertemente representados o recurrentes para asegurar que la recomendación "se parezca" a lo que el usuario ya disfruta.
    3.  **Genera UNA recomendación de libro.**
        * El libro recomendado debe ser **diferente** a cualquiera de los libros ya listados por el usuario.
        * El libro recomendado debe ser coherente con las preferencias inferidas del usuario. No importa la extensión del libro o si es parte de una saga.
    4.  **Formato Estricto de Respuesta:** Tu respuesta DEBE comenzar con la frase "El libro recomendado es:" seguida únicamente por el TÍTULO DEL LIBRO y el NOMBRE DEL AUTOR. No añadas ninguna otra palabra, descripción, justificación o saludo.

    **Ejemplo de lógica interna (esto es para guiar el pensamiento de la IA, no debe incluirse en la respuesta final al usuario de la app):** Si la lista del usuario contiene muchos libros de Stephen King y algunos de Edgar Allan Poe, una buena recomendación podría ser otro autor de terror moderno con un estilo similar, o un clásico del horror gótico. Si ha leído mucho Dr. Stone y también ciencia ficción clásica como Fundación, podrías buscar otra obra de ciencia ficción con elementos de construcción de civilizaciones, supervivencia o un fuerte componente científico, o incluso un manga similar si la predominancia del usuario es el manga. El objetivo es identificar una veta clara en los gustos del usuario y ofrecer algo nuevo dentro de esa veta.`;
    console.log(content);
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: content,
    });
    if (!response || !response.text) {
      throw new NotFoundException('No recommendations found');
    }
    console.log(response.text);

    // ... después de obtener la respuesta de la IA
    const rawResponseText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text; // Ajusta esto según la estructura real de tu SDK

    if (!rawResponseText) {
      this.logger.warn('AI did not return any text content.'); // Asumiendo que tienes un logger
      throw new NotFoundException('No recommendations found from AI.');
    }

    const recommendationPrefix = 'El libro recomendado es:';
    if (!rawResponseText.startsWith(recommendationPrefix)) {
      this.logger.error(
        `AI response did not follow the expected format: ${rawResponseText}`,
      );
      // Podrías intentar "limpiar" la respuesta si es un error menor, o simplemente fallar.
      throw new InternalServerErrorException(
        'Failed to get a valid recommendation due to formatting issues.',
      );
    }

    // const recommendedBookInfo = rawResponseText
    //   .substring(recommendationPrefix.length)
    //   .trim();
    // if (recommendedBookInfo.split(' by ').length < 2) {
    //   // Validación simple de "Título by Autor"
    //   this.logger.error(
    //     `AI response format for book/author is invalid: ${recommendedBookInfo}`,
    //   );
    //   throw new InternalServerErrorException(
    //     'Failed to parse book and author from AI recommendation.',
    //   );
    // }

    console.log(rawResponseText); // o this.logger.debug(rawResponseText);
    return rawResponseText;
  }
}
