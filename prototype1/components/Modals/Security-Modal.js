import React from 'react';
import { Button, View, Text, Pressable } from 'react-native';
import { useState } from 'react';

import Modal from '../Modal';

function SecurityModalScreen({ }) {
    const handleSecurityPress = () => setSecurityModalVisible(true);
    const closeSecurityModal = () => setSecurityModalVisible(false);
    const handleSecuritySave = () => {
        closeSecurityModal();
    };

    return (
        <Modal>
            
        </Modal>
    );
}

export default SecurityModalScreen;