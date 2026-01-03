import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { TProductSizeType } from '@modules/products/lib/enums';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import React from 'react';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES, TOrderPaymentStatusType } from '../lib/enums';

Font.register({
  family: 'Noto Sans Bengali',
  fonts: [
    {
      src: '/fonts/notoSansBengali/regular.ttf',
    },
    {
      src: '/fonts/notoSansBengali/light.ttf',
      fontWeight: 'light',
    },
    {
      src: '/fonts/notoSansBengali/medium.ttf',
      fontWeight: 'medium',
    },
    {
      src: '/fonts/notoSansBengali/semibold.ttf',
      fontWeight: 'semibold',
    },
    {
      src: '/fonts/notoSansBengali/bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/notoSansBengali/extrabold.ttf',
      fontWeight: 'ultrabold',
    },
    {
      src: '/fonts/notoSansBengali/black.ttf',
      fontWeight: 'heavy',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans Bengali',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#fff',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  watermark: {
    transform: 'rotate(-45deg)',
    fontSize: 80,
    fontWeight: 'ultrabold',
    color: 'rgba(0, 0, 0, 0.01)',
    opacity: 0.1,
  },
  watermarkPaid: {
    color: 'rgba(34, 197, 94, 0.015)',
  },
  watermarkNotPaid: {
    color: 'rgba(239, 68, 68, 0.015)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2pt solid #e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 120,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  invoiceDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  billTo: {
    marginBottom: 30,
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  billToRow: {
    fontSize: 10,
    marginBottom: 4,
    color: '#4b5563',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    fontWeight: 'semibold',
    borderBottom: '1pt solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottom: '1pt solid #e5e7eb',
  },
  tableRowWrapper: {
    width: '100%',
  },
  col1: {
    width: '5%',
  },
  col2: {
    width: '40%',
  },
  col3: {
    width: '10%',
    textAlign: 'center',
  },
  col4: {
    width: '15%',
    textAlign: 'right',
  },
  col5: {
    width: '15%',
    textAlign: 'right',
  },
  col6: {
    width: '15%',
    textAlign: 'right',
  },
  productDetails: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
    lineHeight: 1.4,
  },
  totalsContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingVertical: 6,
    fontSize: 10,
  },
  totalDivider: {
    width: 250,
    borderTop: '1pt solid #e5e7eb',
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1pt solid #e5e7eb',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#374151',
  },
  footerValue: {
    fontSize: 10,
    color: '#6b7280',
  },
  thankYou: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 11,
    color: '#6b7280',
    fontWeight: 'medium',
  },
  paymentStatus: {
    position: 'absolute',
    top: 40,
    right: 40,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusPaid: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusUnpaid: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});

interface IProduct {
  name: string;
  specification: string;
  salePrice: number;
  saleDiscountPrice: number;
  quantity: number;
  mfg: string;
  exp: string;
  color: string;
  size: TProductSizeType;
  weight: string;
}

interface IOrder {
  webLogo: string;
  webTitle: string;
  moneyReceiptDate: string;
  trxId: TId;
  customerName: string;
  phone: string;
  streetAddress: string;
  deliveryZone: string;
  products: IProduct[];
  coupon: number;
  discount: number;
  vat: number;
  vatPercent: number;
  tax: number;
  taxPercent: number;
  deliveryCharge: number;
  subTotal: number;
  roundOff: number;
  grandTotal: number;
  paymentStatus: TOrderPaymentStatusType;
  receivedBy: string;
}

interface IProps {
  order: IOrder;
}

const Invoice: React.FC<IProps> = ({
  order: {
    webLogo,
    webTitle,
    moneyReceiptDate,
    trxId,
    customerName,
    phone,
    streetAddress,
    deliveryZone,
    products,
    coupon,
    discount,
    vat,
    vatPercent,
    tax,
    taxPercent,
    deliveryCharge,
    subTotal,
    roundOff,
    grandTotal,
    paymentStatus,
    receivedBy,
  },
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkContainer}>
          <Text
            style={[
              styles.watermark,
              paymentStatus === ENUM_ORDER_PAYMENT_STATUS_TYPES.PAID ? styles.watermarkPaid : styles.watermarkNotPaid,
            ]}
          >
            {Toolbox.toPrettyText(paymentStatus)}
          </Text>
        </View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {webLogo ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={webLogo} style={styles.logo} />
            ) : (
              <Text style={styles.companyName}>{webTitle}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceNumber}>{trxId}</Text>
            <Text style={styles.invoiceDate}>Date: {moneyReceiptDate}</Text>
          </View>
        </View>
        <View style={styles.billTo}>
          <Text style={styles.billToTitle}>BILL TO:</Text>
          <Text style={styles.billToRow}>{customerName}</Text>
          <Text style={styles.billToRow}>Phone: {phone}</Text>
          <Text style={styles.billToRow}>Address: {streetAddress}</Text>
          <Text style={styles.billToRow}>Delivery Zone: {deliveryZone}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Item Description</Text>
            <Text style={styles.col3}>Qty</Text>
            <Text style={styles.col4}>Unit Price</Text>
            <Text style={styles.col5}>Discount</Text>
            <Text style={styles.col6}>Total</Text>
          </View>
          {products.map((product, idx) => {
            const unitPrice = product.salePrice;
            const finalPrice = product.saleDiscountPrice || product.salePrice;
            const discountAmount = product.saleDiscountPrice ? unitPrice - product.saleDiscountPrice : 0;
            const total = finalPrice * product.quantity;

            return (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <Text style={styles.col1}>{idx + 1}</Text>
                <View style={styles.col2}>
                  <Text>{product.name}</Text>
                  {(product.specification ||
                    product.mfg ||
                    product.exp ||
                    product.color ||
                    product.size ||
                    product.weight) && (
                    <Text style={styles.productDetails}>
                      {product.specification && `${product.specification}\n`}
                      {product.mfg && `MFG: ${dayjs(product.mfg).format(Dayjs.date)} `}
                      {product.exp && `EXP: ${dayjs(product.exp).format(Dayjs.date)}\n`}
                      {product.color && `Color: ${product.color} `}
                      {product.size && `Size: ${product.size} `}
                      {product.weight && `Weight: ${product.weight}`}
                    </Text>
                  )}
                </View>
                <Text style={styles.col3}>{product.quantity}</Text>
                <Text style={styles.col4}>{Toolbox.withCurrency(unitPrice)}</Text>
                <Text style={styles.col5}>{discountAmount > 0 ? Toolbox.withCurrency(discountAmount) : '-'}</Text>
                <Text style={styles.col6}>{Toolbox.withCurrency(total)}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.totalsContainer} wrap={false}>
          <View style={styles.totalRow}>
            <Text>Coupon:</Text>
            <Text>{Toolbox.withCurrency(coupon)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Discount:</Text>
            <Text>{Toolbox.withCurrency(discount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>VAT {vatPercent ? `(${vatPercent}%)` : ''}:</Text>
            <Text>{Toolbox.withCurrency(vat)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax {taxPercent ? `(${taxPercent}%)` : ''}:</Text>
            <Text>{Toolbox.withCurrency(tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery Charge:</Text>
            <Text>{Toolbox.withCurrency(deliveryCharge)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Sub Total:</Text>
            <Text>{Toolbox.withCurrency(subTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Round Off:</Text>
            <Text>{Toolbox.withCurrency(roundOff)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.grandTotalRow}>
            <Text>Grand Total:</Text>
            <Text>{Toolbox.withCurrency(grandTotal)}</Text>
          </View>
        </View>
        <View style={styles.footer} wrap={false}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Received By:</Text>
            <Text style={styles.footerValue}>{receivedBy || '---'}</Text>
          </View>
          <Text style={styles.thankYou}>Thank you, please come again!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
