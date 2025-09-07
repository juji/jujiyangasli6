export type WorkImage = {
  thumbnail: string;
  small: string;
  url: string;
  title: string;
  dimension: {
    thumb: {
      width: number;
      height: number;
    };
    small: {
      width: number;
      height: number;
    };
    image: {
      width: number;
      height: number;
    };
  };
};

export type WorkLogo = {
  url: string;
  width: number;
  height: number;
};

type WorkBase = {
  id: string;
  title: string;
  year: string;
  url: string;
  logo: WorkLogo;
  zombie?: boolean;
  gradientColor: string;
};

export type Work = WorkBase & {
  images: WorkImage[];
};

export type WorkContent = Work & {
  content: string;
};

export type WorkSingle = WorkBase & {
  image: WorkImage;
};
