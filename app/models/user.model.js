/* Нам не обязательно определять в модели поле id, так как sequelize по умолчанию
   также будет создавать подобное поле, которое будет выполнять роль первичного ключа.
   По умолчанию будут создаваться два дополнительных поля: createdAt и updatedAt, которые будут
   иметь тип datetime и будут представлять соответственно время создания и последнего обновления
   строки в таблице.
 */
export default (sequelize, Sequelize) => {
    return sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
        }
    });
};