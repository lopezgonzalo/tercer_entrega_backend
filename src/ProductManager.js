import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkFile = () => {
        // si el archivo no existe lo crea. si existe no hace nada
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    async addProduct(titulo, descripcion, precio, imagen, codigo, stock) {
        const prodObj = { titulo, descripcion, precio, imagen, codigo, stock };

        // compueba si los campos estan todos completos
        if (Object.values(prodObj).includes("") || Object.values(prodObj).includes(null)) {
            console.log("Missing product field");
        } else {
            this.checkFile();
            try {
                // lee el archivo
                const read = await fs.readFile(this.path, "utf-8");
                let data = JSON.parse(read);
                // chequea el codigo
                if (data.some((elem) => elem.codigo === prodObj.codigo)) {
                    throw "El codigo " + codigo + " ya existe";
                } else {
                    let newID;
                    !data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
                    // carga el el objeto en la siguiente posicion del array
                    data.push({ ...prodObj, id: newID });
                    // escribe los datos en el array
                    await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getProducts() {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(read);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getProductByID(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const found = data.find((prod) => prod.id === id);
            if (!found) {
                throw "ID no existe";
            } else {
                return found;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async updateProduct(id, titulo, descripcion, precio, imagen, codigo, stock) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            if (data.some((prod) => prod.id === id)) {
                const index = data.findIndex((prod) => prod.id === id);
                data[index].titulo = titulo;
                data[index].descripcion = descripcion;
                data[index].precio = precio;
                data[index].imagen = imagen;
                data[index].codigo = codigo;
                data[index].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "ID no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((prod) => prod.id === id);
            if (index !== -1) {
                data.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "El ID " + id + " no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProductManager;

// TESTING
// - Crear instancia de ProductManager
const manager = new ProductManager("./database.json");
// - Agregar productos
manager.addProduct("producto prueba1", "Este es un producto prueba1", 200, "Sin imagen", "abc123", 25);
manager.addProduct("producto prueba2", "Este es un producto prueba2", 200, "Sin imagen", "bc123", 25);
manager.addProduct("producto prueba3", "Este es un producto prueba3", 200, "Sin imagen", "c123", 25);
manager.addProduct("producto prueba4", "Este es un producto prueba4", 200, "Sin imagen", "123", 25);
manager.addProduct("producto prueba5", "Este es un producto prueba5", 200, "Sin imagen", "23", 25);
manager.getProducts();
manager.getProductByID(2);
//manager.updateProduct(...);
manager.deleteProduct(3);
