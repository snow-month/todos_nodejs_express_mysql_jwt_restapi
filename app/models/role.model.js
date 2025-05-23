export default (sequelize, Sequelize) => {
    return sequelize.define("roles", {
        name: {
            type: Sequelize.STRING,
        }
    });
};