import {
    doc,
    getDoc,
} from 'firebase/firestore';

export async function getGithubToken(db, uid)  {
    const userRef = doc(db, 'users', uid)
    const user = await getDoc(userRef)
    const userData = user.data()
    return userData.token
}