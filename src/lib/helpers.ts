import fetch from 'node-fetch';

export async function request(uri: string) {
    const req = await fetch(uri, { compress: true, timeout: 30000 });
    if (req.status !== 200) {
        return null;
    }
    return await req.json();
}
