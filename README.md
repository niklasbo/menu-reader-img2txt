# Menu Reader: Image OCR Service

Handles OCR 

## Archive Note :ledger:
Due to Covid-19 pandemic this service was archived. Everybody works remotely so there is no need for this anymore.

## API
| Path          | Parameter   | Function                           |
|---------------|-------------|------------------------------------|
| /             | none        | online check                       |
| /ocr          | none        | reads image and does ocr on it     |
| /ocr/:weekId  | weekId a number | reads the image with the given id and does ocr on it |

### Run with
        
    node app.js

### Run tests with

    npm run test

### Environment Variables 
    
- MONGODB_CONNECTION_STRING
- MONGODB_WEEKNUM_IMAGE_COLLECTION
- MONGODB_WEEKDAYMEAL_COLLECTION
