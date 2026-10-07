import cron from 'node-cron';
import { prisma } from './prisma';
import { DonorStatus } from '../../../generated/prisma/enums';

export const deleteRejectedDonors = async () => {
    
    cron.schedule('*/10 * * * *', async () => {
        try {
            
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const deletedDonors = await prisma.donor.deleteMany({
                where: {
                    status: DonorStatus.REJECTED,
                    updatedAt: { lt: twentyFourHoursAgo }, 
                },
            });

            if (deletedDonors.count > 0) {
                console.log(`
                Cron: Deleted ${deletedDonors.count} rejected donor applications older than 24 hours.
                `);
            }
        } catch (error) {
            console.log("Cron: Failed to delete rejected donor applications", error);
        }

        console.log("Rejected Donor Delete cron schedule ran (every 10 minutes)");
    });
};