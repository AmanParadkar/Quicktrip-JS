// services/packageService.js

import Package from '../models/Package';

const packageService = {
  createPackage: async (packageData) => {
    try {
      const packagee = await Package.create(packageData);
      return packagee;
    } catch (error) {
      throw new Error('Error creating package: ' + error.message);
    }
  },

  getPackageById: async (packageId) => {
    try {
      const packagee = await Package.findByPk(packageId);
      return packagee;
    } catch (error) {
      throw new Error('Error fetching package: ' + error.message);
    }
  },

  updatePackage: async (packageId, packageData) => {
    try {
      const packagee = await Package.findByPk(packageId);
      if (!packagee) {
        throw new Error('Package not found');
      }
      await packagee.update(packageData);
      return packagee;
    } catch (error) {
      throw new Error('Error updating package: ' + error.message);
    }
  },

  deletePackage: async (packageId) => {
    try {
      const packagee = await Package.findByPk(packageId);
      if (!packagee) {
        throw new Error('Package not found');
      }
      await packagee.destroy();
      return 'Package deleted successfully';
    } catch (error) {
      throw new Error('Error deleting package: ' + error.message);
    }
  },

  // Add more functions as needed
};

export default packageService;
