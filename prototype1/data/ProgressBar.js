
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.filler, { width: `${progress}%` }]}>
                <Text style={styles.label}>{`${progress.toFixed(1)}%`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 20,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 50,
        overflow: 'hidden',
    },
    filler: {
        height: '100%',
        backgroundColor: '#76c7c0',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProgressBar;
