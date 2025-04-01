declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_API_KEY: string;
        REACT_APP_BASE_URL: string;
        REACT_APP_IMAGE_URL: string;
      }
    }
  }
  
  export {}