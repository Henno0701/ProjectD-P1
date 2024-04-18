import React from 'react';
import { Button, View, Text, Pressable } from 'react-native';
import { useState } from 'react';

import Modal from '../Modal';

function ContactModalScreen({}) {
    const handleContactDetailsPress = () => setContactDetailsModalVisible(true);
    const closeContactDetailsModal = () => setContactDetailsModalVisible(false);
    const handleContactDetailsSave = () => {
        closeContactDetailsModal();
    };

    return (
        <Modal>
            
        </Modal>
    );
}

export default ContactModalScreen;