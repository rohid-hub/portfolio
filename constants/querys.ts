export const BlogsQuery = `
{
  slug
  title
  createdAt
  coverPhoto {
    url
  }
  tags {
    slug
    name
    backgroundColor {
      css
      rgba {
        r
        g
        b
        a
      }
    }
    foregroundColor {
      css
      rgba {
        r
        g
        b
        a
      }
    }
  }
}`;
