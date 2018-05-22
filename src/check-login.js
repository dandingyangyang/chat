import uitls from './utils';
const { get } = uitls;
export default function checkLogin () {
    return get('/api/check-login');
}

