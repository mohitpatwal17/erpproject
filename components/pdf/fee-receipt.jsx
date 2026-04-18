"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#1a365d',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collegeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  collegeAddress: {
    fontSize: 10,
    color: '#718096',
    marginTop: 4,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoCol: {
    width: '45%',
  },
  label: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    marginTop: 20,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f7fafc',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  col1: { width: '60%' },
  col2: { width: '40%', textAlign: 'right' },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalBox: {
    width: '40%',
    padding: 10,
    backgroundColor: '#1a365d',
    color: 'white',
    borderRadius: 4,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#a0aec0',
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    paddingTop: 20,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#333',
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 10,
  }
});

export const FeeReceiptPDF = ({ student, transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <View>
            <Text style={styles.collegeName}>ERPNisha University</Text>
            <Text style={styles.collegeAddress}>123 Knowledge Park, New Delhi, India</Text>
            <Text style={styles.collegeAddress}>Phone: +91 98765 43210 | info@erpnisha.edu</Text>
          </View>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.label}>Receipt No:</Text>
          <Text style={styles.value}>{transaction?.id?.slice(-8).toUpperCase()}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(transaction?.paidAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.receiptTitle}>OFFICIAL FEE RECEIPT</Text>

      {/* Student Details */}
      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{student?.user?.name}</Text>
          <Text style={styles.label}>Roll Number:</Text>
          <Text style={styles.value}>{student?.rollNumber}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Course / Program:</Text>
          <Text style={styles.value}>{student?.course}</Text>
          <Text style={styles.label}>Semester:</Text>
          <Text style={styles.value}>Semester {student?.semester}</Text>
        </View>
      </View>

      {/* Payment Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.col1, { fontWeight: 'bold' }]}>Description</Text>
          <Text style={[styles.col2, { fontWeight: 'bold' }]}>Amount (INR)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col1}>{transaction?.type || 'Tuition Fee'}</Text>
          <Text style={styles.col2}>₹{transaction?.amount?.toLocaleString()}</Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalBox}>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>Total Amount Paid</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>₹{transaction?.amount?.toLocaleString()}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>{transaction?.method || 'Cash'}</Text>
        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>{transaction?.transactionId || 'N/A'}</Text>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <View>
          <View style={styles.signatureLine} />
          <Text style={{ marginTop: 5 }}>Authorized Signatory</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This is a computer-generated receipt and does not require a physical signature.</Text>
        <Text style={{ marginTop: 4 }}>© 2025 ERPNisha Institutions. All rights reserved.</Text>
      </View>
    </Page>
  </Document>
);
