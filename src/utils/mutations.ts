export const createProductMutation = (title: string, descriptionHtml: string, productType: string, vendor: string) => `mutation CreateProduct {
    productCreate(input: {
      title: "${title}"
      published: true
      descriptionHtml: "${descriptionHtml}"
      productType: "${productType}"
      vendor: "${vendor}"
    }
      
      media: [{
        mediaContentType: IMAGE
        originalSource: "https://smaller-pictures.appspot.com/images/dreamstime_xxl_65780868_small.jpg"
        alt: "Black hoodie on a hanger"
         }]) {
      product {
        id
        title
        media(first: 5) {
          edges {
            node {
              mediaContentType
              alt
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;