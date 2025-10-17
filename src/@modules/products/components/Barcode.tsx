import { TId } from '@base/interfaces';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  barcodeContainer: {
    width: '31%',
    textAlign: 'center',
  },
  barcodeImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  barcodeText: {
    fontSize: 8,
    marginTop: 4,
  },
});

const generateBarcodeUrlFn = (value: TId) => {
  const canvas = createCanvas(240, 80);

  JsBarcode(canvas, value.toString(), {
    format: 'CODE128',
    width: 1.4,
    height: 60,
    displayValue: false,
    margin: 0,
  });

  return canvas.toDataURL('image/png');
};

interface IProps {
  code: TId;
  count: number;
}

const Barcode: React.FC<IProps> = ({ code, count }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={[styles.barcodeContainer, { marginBottom: count === idx + 1 ? 0 : 10 }]}>
          {
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image style={styles.barcodeImage} src={generateBarcodeUrlFn(code)} />
          }
          <Text style={styles.barcodeText}>{code}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default Barcode;
