"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductMutation = void 0;
const createProductMutation = (title, descriptionHtml, productType, vendor) => `mutation CreateProduct {
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
exports.createProductMutation = createProductMutation;
