import axios from 'axios';
import qs from "qs";
import { BookQueryType } from '@/type';


export async function getBookList(params?: BookQueryType) {
    const res = await axios(`https://mock.apifox.cn/m1/2398938-0-default/api/books?${qs.stringify(params)}`);
    return res.data;
}