import { TId } from '@base/interfaces';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Canvg } from 'canvg';
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
    marginBottom: 10,
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
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svg, value.toString(), {
    format: 'CODE128',
    width: 1.4,
    height: 60,
    displayValue: false,
    margin: 0,
  });

  const canvas = document.createElement('canvas');

  canvas.width = 240;
  canvas.height = 80;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  const svgElement = Canvg.fromString(context, svg.outerHTML);
  svgElement.render();

  return canvas.toDataURL('image/png');
};

interface IProps {
  code: TId;
  count: number;
}

const Barcode: React.FC<IProps> = ({ code, count }) => {
  const barcodeUrl = generateBarcodeUrlFn(code);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {Array.from({ length: count }).map((_, idx) => (
          <View key={idx} style={styles.barcodeContainer}>
            {
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.barcodeImage} src={barcodeUrl} />
            }
            <Text style={styles.barcodeText}>{code}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default Barcode;
