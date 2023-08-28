import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Dropdown,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
// import Turnstone from 'turnstone'
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import 'react-bootstrap-typeahead/css/Typeahead.css';


const Accounting = () => {

  const [listbox, setListbox] = useState({ data: [] });

  // useEffect(() => {
  //   axios.get('http://localhost:8000/api/worker/', {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //     .then(response => {
  //       setListbox({ data: response.data.map(item => item.username) });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);

  console.log(listbox);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/worker/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setOptions(response.data.map(item => item.username));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);





  // const listbox = {
  //   displayField: 'characters',
  //   data: async (query) => {
  //     const res = await fetch(
  //       `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&apikey=${process.env.REACT_APP_MARVEL_APIKEY}`
  //     )
  //     const data = await res.json()
  //     return data.data.results
  //   },
  //   searchType: 'startsWith',
  // }

  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* <Turnstone
          cancelButton={true}
          debounceWait={250}
          id="search"
          listbox={listbox}
          listboxIsImmutable={true}
          matchText={true}
          maxItems={6}
          name="search"
          noItemsMessage="We found no places that match your search"
          placeholder="Enter a city or airport"
          typeahead={true}
        /> */}

        <Typeahead
          clearButton
          id="selections-example"
          labelKey="name"
          options={options}
          placeholder="Выберите сотрудника..."
        />

        {/* Table */}
      </Container>
    </>
  );
};

export default Accounting;
