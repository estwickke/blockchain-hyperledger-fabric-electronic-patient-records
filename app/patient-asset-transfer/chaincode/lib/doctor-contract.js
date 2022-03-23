/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-14 21:50:38
 * @modify date 2021-02-05 20:03:33
 * @desc [Smartcontract to read, update patient details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let Patient = require('./Patient.js');
const AdminContract = require('./admin-contract.js');
const PrimaryContract = require("./primary-contract.js");
let Image = require('./image.js');
const {
    Context
} = require('fabric-contract-api');

class DoctorContract extends AdminContract {

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {

        let asset = await PrimaryContract.prototype.readPatient(ctx, patientId)

        // Get the doctorID, retrieves the id used to connect the network
        const doctorId = await this.getClientId(ctx);
        // Check if doctor has the permission to read the patient
        const permissionArray = asset.permissionGranted;
        if (!permissionArray.includes(doctorId)) {
            throw new Error(`The doctor ${doctorId} does not have permission to patient ${patientId}`);
        }
        asset = ({
            patientId: patientId,
            firstName: asset.firstName,
            lastName: asset.lastName,
            age: asset.age,
            bloodGroup: asset.bloodGroup,
            allergies: asset.allergies,
            symptoms: asset.symptoms,
            diagnosis: asset.diagnosis,
            treatment: asset.treatment,
            followUp: asset.followUp
        });
        return asset;
    }

    //This function is to update patient medical details. This function should be called by only doctor.
    async updatePatientMedicalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let patientId = args.patientId;
        let newSymptoms = args.symptoms;
        let newDiagnosis = args.diagnosis;
        let newTreatment = args.treatment;
        let newFollowUp = args.followUp;
        let updatedBy = args.changedBy;

        const patient = await PrimaryContract.prototype.readPatient(ctx, patientId);

        if (newSymptoms !== null && newSymptoms !== '' && patient.symptoms !== newSymptoms) {
            patient.symptoms = newSymptoms;
            isDataChanged = true;
        }

        if (newDiagnosis !== null && newDiagnosis !== '' && patient.diagnosis !== newDiagnosis) {
            patient.diagnosis = newDiagnosis;
            isDataChanged = true;
        }

        if (newTreatment !== null && newTreatment !== '' && patient.treatment !== newTreatment) {
            patient.treatment = newTreatment;
            isDataChanged = true;
        }

        if (newFollowUp !== null && newFollowUp !== '' && patient.followUp !== newFollowUp) {
            patient.followUp = newFollowUp;
            isDataChanged = true;
        }

        if (updatedBy !== null && updatedBy !== '') {
            patient.changedBy = updatedBy;
        }

        if (isDataChanged === false) return;

        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //Read patients based on lastname
    async queryPatientsByLastName(ctx, lastName) {
        return await super.queryPatientsByLastName(ctx, lastName);
    }

    //Read patients based on firstName
    async queryPatientsByFirstName(ctx, firstName) {
        return await super.queryPatientsByFirstName(ctx, firstName);
    }

    //Retrieves patient medical history based on patientId
    async getPatientHistory(ctx, patientId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
        let asset = await this.getAllPatientResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    //Retrieves all patients details
    async queryAllPatients(ctx, doctorId) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllPatientResults(resultsIterator, false);
        const permissionedAssets = [];
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            if ('permissionGranted' in obj.Record && obj.Record.permissionGranted.includes(doctorId)) {
                permissionedAssets.push(asset[i]);
            }
        }

        return this.fetchLimitedFields(permissionedAssets);
    }

    //Retrieves all images to querying hospital
   // async queryAllImages(ctx, hospitalId) {
   //     let resultsIterator = await ctx.stub.getStateByRange('', '');
    //    let asset = await this.getAllPatientResults(resultsIterator, false);
    //    const permissionedAssets = [];
     //   for (let i = 0; i < asset.length; i++) {
      //      const obj = asset[i];
       //     if ('permissionGranted' in obj.Record && obj.Record.permissionGranted.includes(hospitalId)) {
        //        permissionedAssets.push(asset[i]);
        //    }
      //  }

      //  return this.fetchLimitedFields(permissionedAssets);
   // }

    //Create imageAsset in the ledger
    async uploadImage(ctx, args) {
        args = JSON.parse(args);

        let newImage = await new Image(args.imageName, args.ownerHosp, args.uploadedBy);
        const buffer = Buffer.from(JSON.stringify(newImage));
        await ctx.stub.putState(newImage.imageName, buffer);
    }

    //Image preview details
    async readImage(ctx, patientId) {
        let asset = await super.readImage(ctx, imageName)

        asset = ({
            imageName: imageName,
            ownerHosp: asset.ownerHosp,
            uploadedBy: asset.uploadedBy,
        });
        return asset;
    }

    async transferImage(ctx, args) {
        args = JSON.parse(args);
        //let newHospOwner = args.ownerHosp;

        //const image = await PrimaryContract.prototype.readImage(ctx, imageName);
        let newImage = await new Image(args.imageName, args.ownerHosp, args.file, args.transferredBy);

        console.log(newImage);
        //if (newHospOwner !== image.ownerHosp) {
        //    image.ownerHosp = newHospOwner;
        // }

        const buffer = Buffer.from(JSON.stringify(newImage));
        //await ctx.stub.putState(newImage.imageName, buffer);

        //let temp = newImage.imageID;
        //let imageIDString = temp.toString();

        await ctx.stub.putPrivateData('hosp1-PrivateCollection', newImage.ownerHosp, buffer);
        console.log("TransferImage" + '176767677676776767767767676' + newImage.ownerHosp);
        //return this.fetchLimitedFields(buffer);
    }

    async transferImageHosp1(ctx, args) {
        args = JSON.parse(args);
        //let newHospOwner = args.ownerHosp;

        //const image = await PrimaryContract.prototype.readImage(ctx, imageName);
        let newImage = await new Image(args.imageName, args.ownerHosp, args.file, args.transferredBy);
        console.log(newImage);
        //if (newHospOwner !== image.ownerHosp) {
        //    image.ownerHosp = newHospOwner;
        // }

        const buffer = Buffer.from(JSON.stringify(newImage));
        //await ctx.stub.putState(newImage.imageName, buffer);
        await ctx.stub.putPrivateData('hosp1-PrivateCollection', newImage.ownerHosp, buffer);
        console.log("TransferImage" + '176767677676776767767767676' + newImage.ownerHosp);
        //return this.fetchLimitedFields(buffer);
    }

    async transferImageHosp2(ctx, args) {
        args = JSON.parse(args);
        //let newHospOwner = args.ownerHosp;

        //const image = await PrimaryContract.prototype.readImage(ctx, imageName);
        let newImage = await new Image(args.imageName, args.ownerHosp, args.file, args.transferredBy);
        console.log(newImage);
        //if (newHospOwner !== image.ownerHosp) {
        //    image.ownerHosp = newHospOwner;
        // }

        const buffer = Buffer.from(JSON.stringify(newImage));
        //await ctx.stub.putState(newImage.imageName, buffer);
        await ctx.stub.putPrivateData('hosp2-PrivateCollection', newImage.ownerHosp, buffer);
        console.log("TransferImage" + '176767677676776767767767676' + newImage.ownerHosp);
        //return this.fetchLimitedFields(buffer);
    }

    async transferImageHosp3(ctx, args) {
        args = JSON.parse(args);
        //let newHospOwner = args.ownerHosp;

        //const image = await PrimaryContract.prototype.readImage(ctx, imageName);
        let newImage = await new Image(args.imageName, args.ownerHosp, args.file, args.transferredBy);
        console.log(newImage);
        //if (newHospOwner !== image.ownerHosp) {
        //    image.ownerHosp = newHospOwner;
        // }

        const buffer = Buffer.from(JSON.stringify(newImage));
        //await ctx.stub.putState(newImage.imageName, buffer);
        await ctx.stub.putPrivateData('hosp3-PrivateCollection', newImage.ownerHosp, buffer);
        console.log("TransferImage" + '176767677676776767767767676' + newImage.ownerHosp);
        //return this.fetchLimitedFields(buffer);
    }

    async queryAllTransferredImagesHosp1(ctx) {
        console.log('195959595');
        let resultsIterator = await ctx.stub.getPrivateDataByRange('hosp1-PrivateCollection', '', '');
        const allResults = [];
        while (true) {
            const res = await resultsIterator.iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let imageName;
                let ownerHosp;
                let file;
                let image;
                let Record;
                let transferredBy; 
                try {
                    image = JSON.parse(res.value.value.toString('utf8'));
                    imageName= image.imageName;
                    ownerHosp= image.ownerHosp;
                    file= image.file;
                    transferredBy= image.transferredBy;

                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
               // allResults.push({ Key, Record });
                allResults.push({Key, image});
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
    }
}

async queryAllTransferredImagesHosp2(ctx) {
    console.log('195959595');
    let resultsIterator = await ctx.stub.getPrivateDataByRange('hosp2-PrivateCollection', '', '');
    const allResults = [];
    while (true) {
        const res = await resultsIterator.iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let imageName;
            let ownerHosp;
            let file;
            let image;
            let Record;
            let transferredBy; 
            try {
                image = JSON.parse(res.value.value.toString('utf8'));
                imageName= image.imageName;
                ownerHosp= image.ownerHosp;
                file= image.file;
                transferredBy= image.transferredBy;

            } catch (err) {
                console.log(err);
                Record = res.value.value.toString('utf8');
            }
           // allResults.push({ Key, Record });
            allResults.push({Key, image});
        }
        if (res.done) {
            console.log('end of data');
            await resultsIterator.iterator.close();
            console.info(allResults);
            return JSON.stringify(allResults);
        }
}
}

async queryAllTransferredImagesHosp3(ctx) {
    console.log('195959595');
    let resultsIterator = await ctx.stub.getPrivateDataByRange('hosp3-PrivateCollection', '', '');
    const allResults = [];
    while (true) {
        const res = await resultsIterator.iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let imageName;
            let ownerHosp;
            let file;
            let image;
            let Record;
            let transferredBy; 
            try {
                image = JSON.parse(res.value.value.toString('utf8'));
                imageName= image.imageName;
                ownerHosp= image.ownerHosp;
                file= image.file;
                transferredBy= image.transferredBy;

            } catch (err) {
                console.log(err);
                Record = res.value.value.toString('utf8');
            }
           // allResults.push({ Key, Record });
            allResults.push({Key, image});
        }
        if (res.done) {
            console.log('end of data');
            await resultsIterator.iterator.close();
            console.info(allResults);
            return JSON.stringify(allResults);
        }
}
}

    async queryAllTransferredImages(ctx) {
        console.log('195959595');
        let resultsIterator = await ctx.stub.getPrivateDataByRange('hosp1-PrivateCollection', '', '');
        const allResults = [];
        while (true) {
            const res = await resultsIterator.iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                //var min = 0;
                //var max = 100;
                //var keyCounter = Math.floor(Math.random() * (max - min+1)) + min;
                //var keyCounter = 0;
                const Key = res.value.key;
                //keyCounter++;
                let imageName;
                let ownerHosp;
                let file;
                let image;
                let Record;
                let transferredBy; 
                try {
                    image = JSON.parse(res.value.value.toString('utf8'));
                    imageName= image.imageName;
                    ownerHosp= image.ownerHosp;
                    file= image.file;
                    transferredBy= image.transferredBy;

                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
               // allResults.push({ Key, Record });
                allResults.push({Key, image});
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
    }
}

    fetchLimitedImageFields = asset => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            console.log(Object.values(obj) + '1939393939');
            console.log(Object.keys(obj));
            asset[i] = {
                imageName: obj.imageName,
                ownerHosp: obj.Key,
                file: obj.file,
                transferredBy: obj.transferredBy
            };
        }
        return asset;
    }

    async getAllResults(iterator) {
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value) {
                // if not a getHistoryForKey iterator then key is contained in res.value.key
                allResults.push(res.value.value.toString('utf8'));
            }
    
            // check to see if we have reached then end
            if (res.done) {
                // explicitly close the iterator
                await iterator.close();
                console.log(allResults + '2151515151');
                return allResults;
            }
        }
    }
    

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                patientId: obj.Key,
                firstName: obj.Record.firstName,
                lastName: obj.Record.lastName,
                age: obj.Record.age,
                bloodGroup: obj.Record.bloodGroup,
                allergies: obj.Record.allergies,
                symptoms: obj.Record.symptoms,
                diagnosis: obj.Record.diagnosis,
                treatment: obj.Record.treatment,
                followUp: obj.Record.followUp
            };
            if (includeTimeStamp) {
                asset[i].changedBy = obj.Record.changedBy;
                asset[i].Timestamp = obj.Timestamp;
            }
        }

        return asset;
    };


    /**
     * @author Jathin Sreenivas
     * @param  {Context} ctx
     * @description Get the client used to connect to the network.
     */
    async getClientId(ctx) {
        const clientIdentity = ctx.clientIdentity.getID();
        // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.lithium.com/CN=ca.hosp1.lithium.com'
        let identity = clientIdentity.split('::');
        identity = identity[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
}
module.exports = DoctorContract;