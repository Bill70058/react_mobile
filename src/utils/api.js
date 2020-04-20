import {
  BASE_URL
} from './url'
import axios from 'axios'

const API = axios.create({
  baseURL: BASE_URL
})

export {
  API
}