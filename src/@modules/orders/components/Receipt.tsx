import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { TProductSizeType } from '@modules/products/lib/enums';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import React from 'react';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES, TOrderPaymentStatusType } from '../lib/enums';

Font.register({
  family: 'Alan Sans',
  fonts: [
    {
      src: '/fonts/alansans/regular.ttf',
    },
    {
      src: '/fonts/alansans/light.ttf',
      fontWeight: 'light',
    },
    {
      src: '/fonts/alansans/medium.ttf',
      fontWeight: 'medium',
    },
    {
      src: '/fonts/alansans/semibold.ttf',
      fontWeight: 'semibold',
    },
    {
      src: '/fonts/alansans/bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/alansans/extrabold.ttf',
      fontWeight: 'ultrabold',
    },
    {
      src: '/fonts/alansans/black.ttf',
      fontWeight: 'heavy',
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    position: 'relative',
    fontFamily: 'Alan Sans',
    fontSize: 10,
    padding: 16,
    width: '75mm',
    margin: '0 auto',
    border: '1pt dashed #222',
    borderRadius: 8,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-20deg)',
    fontSize: 24,
    fontWeight: 'ultrabold',
    color: 'rgba(0, 0, 0, 0.1)',
    opacity: 0.3,
    transformOrigin: 'center',
  },
  watermarkPaid: {
    color: 'rgba(34, 197, 94, 0.15)',
  },
  watermarkNotPaid: {
    color: 'rgba(239, 68, 68, 0.15)',
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: { width: 140, marginBottom: 4 },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  date: { textAlign: 'center', fontWeight: 500 },
  trxBox: {
    border: '1pt dashed #bdbed1',
    borderRadius: 4,
    textAlign: 'center',
    paddingVertical: 6,
    marginVertical: 8,
  },
  trxId: { fontSize: 12, fontWeight: 700 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  itemTitle: { maxWidth: 90 },
  dashed: {
    borderBottom: '1pt dashed #bdbed1',
    marginVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    fontSize: 8,
  },
  footer: {
    marginTop: 10,
    borderTop: '1pt dashed #bdbed1',
    paddingTop: 4,
    textAlign: 'center',
  },
  thankYou: { marginTop: 16, fontWeight: 500 },
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
  type?: 'PREVIEW' | 'PRINT';
  order: IOrder;
}

const Receipt: React.FC<IProps> = ({
  type = 'PREVIEW',
  order: {
    webLogo,
    webTitle,
    moneyReceiptDate,
    trxId,
    customerName,
    phone,
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
      <Page size="A4" style={{ padding: 20, position: 'relative' }}>
        <View style={styles.body}>
          <Text
            style={[
              styles.watermark,
              paymentStatus === ENUM_ORDER_PAYMENT_STATUS_TYPES.PAID ? styles.watermarkPaid : styles.watermarkNotPaid,
            ]}
          >
            {Toolbox.toPrettyText(paymentStatus)}
          </Text>
          <View style={styles.header}>
            {webLogo ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={webLogo} style={styles.logo} />
            ) : (
              <Text style={styles.title}>{webTitle}</Text>
            )}
            <Text style={styles.date}>{moneyReceiptDate}</Text>
          </View>
          <View style={styles.trxBox}>
            <Text>Trx Id</Text>
            <Text style={styles.trxId}>{trxId}</Text>
          </View>
          <View>
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>Name</Text>
              <Text>{customerName}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>Phone</Text>
              <Text>{phone}</Text>
            </View>
          </View>
          <View style={[styles.itemRow, styles.dashed]}>
            <Text style={{ width: 170, fontWeight: 500 }}>Title</Text>
            <Text style={{ fontWeight: 500 }}>Amount</Text>
          </View>
          {products.map((product, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={{ width: 170 }}>
                {product.name}
                {product.specification && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}
                    {product.specification}
                  </Text>
                )}
                {product.mfg && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}MFG: {dayjs(product.mfg).format(Dayjs.date)}
                  </Text>
                )}
                {product.exp && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}EXP: {dayjs(product.exp).format(Dayjs.date)}
                  </Text>
                )}
                {product.color && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}Color: {product.color}
                  </Text>
                )}
                {product.size && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}Size: {product.size}
                  </Text>
                )}
                {product.weight && (
                  <Text style={{ fontSize: 8, fontWeight: 300, color: '#666885' }}>
                    {'\n'}Weight: {product.weight}
                  </Text>
                )}
              </Text>
              <View>
                <Text>
                  {product.saleDiscountPrice ? (
                    <Text style={{ textDecoration: 'line-through', marginRight: 4, fontSize: 8 }}>
                      {product.salePrice}
                    </Text>
                  ) : null}
                  <Text>
                    {product.saleDiscountPrice || product.salePrice} ({product.quantity})
                  </Text>
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.dashed}></View>
          {type === 'PRINT' ? (
            <View style={styles.totalRow}>
              <Text>Redeem</Text>
              <Text>{Toolbox.truncateNumber(discount)}</Text>
            </View>
          ) : (
            <React.Fragment>
              <View style={styles.totalRow}>
                <Text>Coupon</Text>
                <Text>{Toolbox.truncateNumber(coupon)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>Discount</Text>
                <Text>{Toolbox.truncateNumber(discount)}</Text>
              </View>
            </React.Fragment>
          )}
          <View style={styles.totalRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text>Vat</Text>
              {!vatPercent || <Text>({vatPercent}%)</Text>}
            </View>
            <Text>{Toolbox.truncateNumber(vat)}</Text>
          </View>
          <View style={styles.totalRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text>Tax</Text>
              {!taxPercent || <Text>({taxPercent}%)</Text>}
            </View>
            <Text>{Toolbox.truncateNumber(tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery Charge</Text>
            <Text>{Toolbox.truncateNumber(deliveryCharge)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Sub Total</Text>
            <Text>{Toolbox.truncateNumber(subTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Round Off</Text>
            <Text>{Toolbox.truncateNumber(roundOff)}</Text>
          </View>
          <View style={styles.dashed}></View>
          <View style={styles.totalRow}>
            <Text>Grand Total</Text>
            <Text>{Toolbox.truncateNumber(grandTotal)}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.itemRow}>
              <Text>Received By</Text>
              <Text>{receivedBy}</Text>
            </View>
            <Text style={styles.thankYou}>Thank You, Please Come Again</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Receipt;
