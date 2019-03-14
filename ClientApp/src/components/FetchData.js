import React, { Component } from 'react';
import axios from 'axios';

export class FetchData extends Component {
  displayName = FetchData.name

  constructor(props) {
    super(props);
      this.state = {
          products: [],
          loading: true,
          newProduct: {
              name: '',
              description: '',
              quantity: 1,
          },
          error: null,
      };

    FetchData.updateProducts = FetchData.updateProducts.bind(this);
    FetchData.handleChange = FetchData.handleChange.bind(this);
    FetchData.handleSubmit = FetchData.handleSubmit.bind(this);
  }

  componentDidMount() {
      FetchData.updateProducts();
  }

  static async updateProducts() {
    await axios.get(`api/products`)
      .then(res => {
        const products = res.data;
        this.setState({ products, loading: false });
      })
  }

  static deleteProduct = async (id) => {
      await axios.delete(`api/products/${id}`);
      FetchData.updateProducts();
  }

  static handleChange(event, data) {
    let product = Object.assign({}, this.state.newProduct);
    product[data] = event.target.value;
    this.setState({ newProduct: product });
  }

  static async handleSubmit(event) {
    const { newProduct } = this.state;
    event.preventDefault();


    await axios.post('api/products', newProduct)
      .catch(function(error) {
          alert(`Name of ${newProduct.name} already exists!`);
      })
    FetchData.updateProducts();
  }

  static renderProductsTable(products) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map(i =>
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.description}</td>
              <td>{i.quantity}</td>
              <td><button onClick={() => FetchData.deleteProduct(i.id)} className="btn btn-danger">Delete</button></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    const { products, loading, newProduct } = this.state;
    let contents = loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderProductsTable(products);

    return (
      <div>
        <h1>Product List</h1>
        <p>This component demonstrates fetching products from the mocked database.</p>
        {contents}

        <h2>Create New Product</h2>
        <form>
            <div className="form-group">
                <label>Name</label>
                <input onChange={(e) => FetchData.handleChange(e, 'name')} value={newProduct.name} required className="form-control" placeholder="Product Name" />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input onChange={(e) => FetchData.handleChange(e, 'description')} value={newProduct.description} required className="form-control" placeholder="Product Description" />
            </div>
            <div className="form-group">
                <label>Quantity</label>
                <input onChange={(e) => FetchData.handleChange(e, 'quantity')} value={newProduct.quantity} type="number" required className="form-control" placeholder="Product Quantity" />
            </div>
            <button onClick={FetchData.handleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}
