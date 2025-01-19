export interface BookOpenLibraryDetails {
  bib_key: string;
  info_url: string;
  preview: string;
  preview_url: string;
  thumbnail_url: string;
  details: Details;
}

interface Details {
  publishers: string[];
  title: string;
  identifiers: unknown;
  covers: number[];
  created: Created;
  isbn_13: string[];
  last_modified: Created;
  publish_date: string;
  key: string;
  latest_revision: number;
  works: Work[];
  type: Work;
  revision: number;
}

interface Work {
  key: string;
}

interface Created {
  type: string;
  value: string;
}
