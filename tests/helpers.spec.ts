import {
  array_chunks,
  serializeSpecialTypes,
  unserializeSpecialTypes,
} from '../src/lib/helpers';
import {expect} from 'chai';
import 'mocha';
import * as admin from 'firebase-admin';

const special = {
  object: {
    name: 'object',
    timestamp: new admin.firestore.Timestamp(1541579025, 0),
  },
  array: {
    0: 1,
    1: new Date(),
  },
  timestamp: new admin.firestore.Timestamp(1541579025, 0),
  geopoint: new admin.firestore.GeoPoint(12.3433, -111.324),
  number: 234234.234,
};

const sampleExportedDoc = require('./sampleExportedDoc.json');

const serialized = {
  object: {
    name: 'object',
    timestamp: {
      __datatype__: 'timestamp',
      value: {
        _seconds: 1541579025,
        _nanoseconds: 0,
      },
    },
  },
  array: {
    '0': 1,
    '1': {
      __datatype__: 'timestamp',
      value: {
        _seconds: 1541579025,
        _nanoseconds: 0,
      },
    },
  },
  timestamp: {
    __datatype__: 'timestamp',
    value: {
      _seconds: 1541579025,
      _nanoseconds: 0,
    },
  },
  geopoint: {
    __datatype__: 'geopoint',
    value: {
      _latitude: 12.3433,
      _longitude: -111.324,
    },
  },
  number: 234234.234,
};

describe('Helpers', () => {
  describe('array_chunks', () => {
    it('should break up an array into the right amount of chunks', () => {
      const startingArray = new Array(100).fill(null);
      const chunks = array_chunks(startingArray, 10);
      expect(chunks).to.have.lengthOf(10);
    });
  });

  describe('serializeSpecialTypes', () => {
    it('should take special types and serialize them as expected.', () => {
      const results = serializeSpecialTypes(special);
      expect(results.timestamp).to.include.all.keys('__datatype__', 'value');
      expect(results.geopoint).to.include.all.keys('__datatype__', 'value');
    });

    it('should handle timestamp', () => {
      const results = serializeSpecialTypes(special);
      expect(results.timestamp.value).to.include.all.keys(
        '_seconds',
        '_nanoseconds'
      );
    });
  });

  describe('unserializeSpecialTypes', () => {
    admin.initializeApp();
    const results = unserializeSpecialTypes(sampleExportedDoc);
    expect(results.sampleExportedDoc.timestamp).to.be.an.instanceof(
      admin.firestore.Timestamp
    );
    expect(results.sampleExportedDoc.geopoint).to.be.an.instanceof(
      admin.firestore.GeoPoint
    );
    expect(results.sampleExportedDoc.documentRef).to.be.an.instanceof(
      admin.firestore.DocumentReference
    );
    expect(results.sampleExportedDoc.documentRef).to.be.an.instanceof(
      admin.firestore.DocumentReference
    );
  });
});
