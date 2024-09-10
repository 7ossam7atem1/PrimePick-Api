import fs from 'fs';
import colors from 'colors'; 
import dotenv from 'dotenv';
import Product from '../../models/productModel';
import connectDB from '../../dbconfig/database';

dotenv.config({ path: '../../.env' });

connectDB();

const products: any[] = JSON.parse(fs.readFileSync('./src/utils/dummy/products.json', 'utf-8'));


const insertData = async (): Promise<void> => {
  try {
    await Product.create(products);
    console.log(colors.green.inverse('Data Inserted'));
    process.exit(0); 
  } catch (error) {
    console.error(error);
    process.exit(1); 
  }
};


const destroyData = async (): Promise<void> => {
  try {
    await Product.deleteMany();
    console.log(colors.red.inverse('Data Destroyed'));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1); 
  }
};


if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
