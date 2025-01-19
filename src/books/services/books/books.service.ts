import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBooksDto } from 'src/books/dto/books.dto';
import { Books } from 'src/books/entities/books.entity';
import {
  BookOpenLibraryData,
  Identifiers,
} from 'src/books/interface/open-library-data';
import { BookOpenLibraryDetails } from 'src/books/interface/open-library-details';
import config from 'src/config';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Books.name) private readonly books: Model<Books>,
    private readonly http: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
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

    return { googleBooks, openLibrary: openLibraryDetailsData };
  }

  generateDataOpenLibraryDetails(
    openLibraryDetails: BookOpenLibraryDetails,
    openLibrary: BookOpenLibraryData,
  ): {
    isbn: Identifiers;
    title: string;
    publishedDate: string;
    authors: string[];
    industryIdentifiers: any[];
    printType: string;
    categories: any[];
    imageLinks: { smallThumbnail: string; thumbnail: string };
    previewLink: string;
    infoLink: string;
    publisher: string;
  } {
    const data = openLibrary;
    const details = openLibraryDetails;
    const standardBook = {
      isbn: data.identifiers,
      title: data.title,
      publishedDate: details.details.publish_date,
      authors: [],
      industryIdentifiers: [],
      printType: 'BOOK',
      categories: [],
      imageLinks: {
        smallThumbnail: data.cover.large,
        thumbnail: data.cover.large,
      },
      previewLink: details.preview_url,
      infoLink: details.info_url,
      publisher: '',
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
}
