export default (sequelize, Sequelize) => {
    return sequelize.define("role", {
        name: {
            type: Sequelize.STRING,
        }
    });
};