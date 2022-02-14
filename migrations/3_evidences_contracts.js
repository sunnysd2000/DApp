const Evidences = artifacts.require("Evidences")

module.exports = function(deployer){
    deployer.deploy(Evidences)
}