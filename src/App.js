import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Table, Row, Col } from 'react-bootstrap';

const api = 'http://localhost:8000';

function App() {
  const [proxies, setProxies] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceUrl: '',
    listenPort: '',
    proxyType: '',
    filterFile: null,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      getProxies();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getProxies = async () => {
    try {
      const response = await axios.get(`${api}/proxies`);
      setProxies(response.data);
    } catch (error) {
      console.error('Error fetching proxies:', error);
    }
  };

  const createProxy = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(`${api}/proxies`, data, config);
      getProxies();
    } catch (error) {
      console.error('Error creating proxy:', error);
    }
  };

  const deleteProxy = async (name) => {
    try {
      await axios.delete(`${api}/proxies/${name}`);
      getProxies();
    } catch (error) {
      console.error('Error deleting proxy:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  return (
    <Container>
      <h1 className="my-4">Proxy Manager</h1>

      <Form onSubmit={createProxy}>
        <Row>
          <Col>
            <Form.Group controlId="serviceName">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="serviceUrl">
              <Form.Label>Service URL</Form.Label>
              <Form.Control
                type="text"
                name="serviceUrl"
                value={formData.serviceUrl}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="listenPort">
              <Form.Label>Listen Port</Form.Label>
              <Form.Control
                type="number"
                name="listenPort"
                value={formData.listenPort}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="proxyType">
              <Form.Label>Proxy Type</Form.Label>
              <Form.Select
                name="proxyType"
                value={formData.proxyType}
                onChange={handleChange}
                required
              >
                <option value="">Select a proxy type</option>
                <option value="http">HTTP</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="Filter File">
<Form.Label>Filter File</Form.Label>
<Form.Control
type="file"
name="filterFile"
onChange={handleChange}
/>
</Form.Group>
</Col>
</Row>
    <Button variant="primary" type="submit">
      Add Proxy
    </Button>
  </Form>

    <h2 className="my-4">Proxies</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {console.log(proxies)}
        {/* {proxies.forEach((proxy) => (
          <tr key={proxy.name}>
            <td>{proxy.name}</td>
            <td>
              <Button variant="danger" onClick={() => deleteProxy(proxy.name)}>
                Delete
              </Button>
            </td>
          </tr>
        ))} */}
      </tbody>
    </Table>
  </Container>
);
}
export default App;


