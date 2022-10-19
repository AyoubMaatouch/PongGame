import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';


export const UsersProviders = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: 'du8vfffcg', 
      api_key: '379118446319473', 
      api_secret: 'r_Di97Y3byGmWSOQC1cjfKXfp18' 
    });
  },
};