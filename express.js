const express = require("express");
const fs = require("fs");
const app = express();

class Contenedor {
  constructor(file) {
    this.file = file;
  }
  static countId = 0;

  static lista = [];

  async save(objeto) {
    Contenedor.countId++;
    objeto["id"] = Contenedor.countId;
    Contenedor.lista.push(objeto);
    await this.write();
    return Contenedor.countId;
  }
  async write() {
    let string = JSON.stringify(Contenedor.lista);
    await fs.promises.writeFile(this.file, string);
  }
  async getAll() {
    try {
      const data = await fs.promises.readFile(this.file, "utf-8");
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const data = await fs.promises.readFile(this.file, "utf-8");
      const dataArray = JSON.parse(data);
      let producto = dataArray.find((item) => item.id == id);
      return producto;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.file, "");
    } catch (error) {
      console.log("no se pudo borrar el contenido");
    }
  }
  async deleteById(id) {
    try {
      const data = await fs.promises.readFile(this.file, "utf-8");
      const dataArray = JSON.parse(data);
      let filteredData = dataArray.filter((item) => item.id != id);
      fs.promises.writeFile(this.file, JSON.stringify(filteredData));
    } catch (error) {
      console.log(error);
    }
  }
}
let contenedor = new Contenedor("contenedor.json");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("servidor correindo puedro 3001");
});

app.get("/productos", (req, res) => {
  (async () => {
    const productos = await contenedor.getAll();
    res.send(productos);
  })();
});
app.get("/productoRandom", (req, res) => {
  (async () => {
    const productos = await contenedor.getAll();
    const productosArray = JSON.parse(productos);
    let randomNumber = Math.floor(Math.random() * productosArray.length);

    res.send(productosArray[randomNumber]);
  })();
});
