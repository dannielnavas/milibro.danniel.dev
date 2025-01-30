import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBooksDto } from 'src/books/dto/books.dto';
import { Books } from 'src/books/entities/books.entity';
import { GoogleBooks, Item } from 'src/books/interface/google-books';
import { BookOpenLibraryData } from 'src/books/interface/open-library-data';
import { BookOpenLibraryDetails } from 'src/books/interface/open-library-details';
import config from 'src/config';

@Injectable()
export class BooksService {
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
    // https://openlibrary.org/api/books?bibkeys=ISBN:978-84-376-0494-7&format=json&jscmd=details
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

  delete(id: string) {
    return this.books.findByIdAndDelete(id);
  }
}
