import { db } from '../firebase.js';
import Community from '../models/modulesCommunity.js';


//get all communities

export const getCommunities = async (req, res, next) => {
    const commsRef = db.collection('communities');
    const comms = await commsRef.get();
    const commsArray = [];

    for (const commDoc of comms.docs) {
        const commData = commDoc.data();

        // // Fetch authors
        // const modulePromises = moduleRefs.map(ref => ref.get());
        // const moduleSnaps = await Promise.all(modulePromises);

        // const modules = moduleSnaps.map(moduleSnap => ({
        //     id: moduleSnap.id,
        //     ...moduleSnap.data()
        // }));

        const c = new Community(
            commDoc.id,
            commData.name, 
            commData.description, 
            commData.moduleNames
        );
        commsArray.push(c);
    }

    res.status(200).send(commsArray);
};
