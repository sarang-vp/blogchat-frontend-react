import React, { Component } from 'react';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [], // Initialize with an empty array to hold contact data
    };
  }

  componentDidMount() {
    // Fetch contact data from your API when the component mounts
    this.fetchContacts();
  }

  fetchContacts = async () => {
    try {
      // Make an API request to fetch contact data from your backend
      const response = await fetch('http://192.168.1.17:3001/viewUsers');
      if (response.ok) {
        const data = await response.json();
        this.setState({ contacts: data }); // Update the state with fetched contact data
      } else {
        console.error('Failed to fetch contact data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    const { contacts } = this.state;

    return (
      <div className="contact-list">
        <h2>Contact List</h2>
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <strong>Name:</strong> {contact.name}<br />
              <strong>Email:</strong> {contact.email}<br />
              <strong>Message:</strong> {contact.message}<br />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ContactList;
