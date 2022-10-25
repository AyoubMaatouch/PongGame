
import { ConfigModule } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';
// import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions  => {
    return v2.config({
        cloud_name: 'du8vfffcg', 
        api_key: '379118446319473', 
        api_secret: 'r_Di97Y3byGmWSOQC1cjfKXfp18' 
    });
  },
};
