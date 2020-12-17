const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
const { getPathToNetwork } = require('../../..');
const { pwnAccountsOnNetwork } = require('./pwnAccounts');
const { simulateExchangeRates } = require('./exchangeRates');
const { takeDebtSnapshot } = require('./debtSnapshot');
const { mockOptimismBridge } = require('./optimismBridge');

async function setup({ network }) {
	const deploymentPath = hre.config.deploymentPath || getPathToNetwork({ network, fs, path });

	const pwnedAccounts = await pwnAccountsOnNetwork({ network });
	const owner = pwnedAccounts.find(a => a.name === 'owner').address;

	if (hre.config.patchFreshDeployment) {
		await simulateExchangeRates({ network, deploymentPath });
		await takeDebtSnapshot({ network, deploymentPath });
		await mockOptimismBridge({ network, deploymentPath });
	}

	return {
		owner,
		deploymentPath,
	};
}

module.exports = {
	setup,
};