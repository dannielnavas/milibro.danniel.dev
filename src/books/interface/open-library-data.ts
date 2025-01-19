export interface BookOpenLibraryData {
  url: string;
  key: string;
  title: string;
  authors: Author[];
  identifiers: Identifiers;
  publishers: Publisher[];
  publish_date: string;
  subjects: Author[];
  subject_places: Author[];
  subject_people: Author[];
  links: Link[];
  cover: Cover;
}

interface Cover {
  small: string;
  medium: string;
  large: string;
}

interface Link {
  title: string;
  url: string;
}

interface Publisher {
  name: string;
}

export interface Identifiers {
  isbn_13: string[];
  openlibrary: string[];
}

interface Author {
  url: string;
  name: string;
}
