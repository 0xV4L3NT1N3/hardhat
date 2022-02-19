import {expect, AssertionError, use} from 'chai';
import { BigNumber as BigNumberEthers } from 'ethers';
import { BigNumber as BigNumberJs } from "bignumber.js";
import BN from "bn.js";

import { bnChai } from "../../../src/chai/matchers/bnChai";

use(bnChai);

describe('UNIT: BigNumber matchers', () => {
  function checkAll(
    actual: number,
    expected: number,
    test: (
      actual: number | string | BigNumberEthers | BigNumberJs | BN,
      expected: number | string | BigNumberEthers | BigNumberJs | BN
    ) => void
  ) {
    const conversions = [
      (n: number) => n,
      (n: number) => n.toString(),
      (n: number) => BigNumberEthers.from(n),
      (n: number) => new BN(n),
      (n: number) => new BigNumberJs(n),
    ];
    for (const convertActual of conversions) {
      for (const convertExpected of conversions) {
        const convertedActual = convertActual(actual);
        const convertedExpected = convertExpected(expected);
        // a few particular combinations of types don't work:
        if (
          typeof convertedActual === "string" &&
          !BigNumberEthers.isBigNumber(convertedExpected) &&
          !BN.isBN(convertedExpected) &&
          !BigNumberJs.isBigNumber(convertedExpected)
        ) {
          continue;
        }
        if (
          typeof convertedActual === "number" &&
          typeof convertedExpected === "string"
        ) {
          continue;
        }
        test(convertedActual, convertedExpected);
      }
    }
  }

  describe('equal', () => {
    it('.to.equal', () => {
      checkAll(10, 10, (a, b) => expect(a).to.equal(b));
    });

    it('.to.eq', () => {
      checkAll(10, 10, (a, b) => expect(a).to.eq(b));
    });

    it('.not.to.equal', () => {
      checkAll(10, 11, (a, b) => expect(a).not.to.equal(b));
    });

    it('.not.to.eq', () => {
      checkAll(10, 11, (a, b) => expect(a).not.to.eq(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumberEthers.from(10)).to.equal(11)).to.throw(AssertionError, 'Expected "10" to be equal 11');
    });
  });

  describe('above', () => {
    it('.to.be.above', () => {
      checkAll(10, 9, (a, b) => expect(a).to.be.above(b));
    });

    it('.to.be.gt', () => {
      checkAll(10, 9, (a, b) => expect(a).to.be.gt(b));
    });

    it('.not.to.be.above', () => {
      checkAll(10, 10, (a, b) => expect(a).not.to.be.above(b));
      checkAll(10, 11, (a, b) => expect(a).not.to.be.above(b));
    });

    it('.not.to.be.gt', () => {
      checkAll(10, 10, (a, b) => expect(a).not.to.be.gt(b));
      checkAll(10, 11, (a, b) => expect(a).not.to.be.gt(b));
    });
  });

  describe('below', () => {
    it('.to.be.below', () => {
      checkAll(10, 11, (a, b) => expect(a).to.be.below(b));
    });

    it('.to.be.lt', () => {
      checkAll(10, 11, (a, b) => expect(a).to.be.lt(b));
    });

    it('.not.to.be.below', () => {
      checkAll(10, 10, (a, b) => expect(a).not.to.be.below(b));
      checkAll(10, 9, (a, b) => expect(a).not.to.be.below(b));
    });

    it('.not.to.be.lt', () => {
      checkAll(10, 10, (a, b) => expect(a).not.to.be.lt(b));
      checkAll(10, 9, (a, b) => expect(a).not.to.be.lt(b));
    });
  });

  describe('at least', () => {
    it('.to.be.at.least', () => {
      checkAll(10, 10, (a, b) => expect(a).to.be.at.least(b));
      checkAll(10, 9, (a, b) => expect(a).to.be.at.least(b));
    });

    it('.to.be.gte', () => {
      checkAll(10, 10, (a, b) => expect(a).to.be.gte(b));
      checkAll(10, 9, (a, b) => expect(a).to.be.gte(b));
    });

    it('.not.to.be.at.least', () => {
      checkAll(10, 11, (a, b) => expect(a).not.to.be.at.least(b));
    });

    it('.not.to.be.gte', () => {
      checkAll(10, 11, (a, b) => expect(a).not.to.be.gte(b));
    });
  });

  describe('at most', () => {
    it('.to.be.at.most', () => {
      checkAll(10, 10, (a, b) => expect(a).to.be.at.most(b));
      checkAll(10, 11, (a, b) => expect(a).to.be.at.most(b));
    });

    it('.to.be.lte', () => {
      checkAll(10, 10, (a, b) => expect(a).to.be.lte(b));
      checkAll(10, 11, (a, b) => expect(a).to.be.lte(b));
    });

    it('.not.to.be.at.most', () => {
      checkAll(10, 9, (a, b) => expect(a).not.to.be.at.most(b));
    });

    it('.not.to.be.lte', () => {
      checkAll(10, 9, (a, b) => expect(a).not.to.be.lte(b));
    });
  });

  function checkAllWith3Args(
    a: number,
    b: number,
    c: number,
    test: (
      a: number | BigNumberEthers | BigNumberJs | BN,
      b: number | BigNumberEthers | BigNumberJs | BN,
      c: number | BigNumberEthers | BigNumberJs | BN
    ) => void
  ) {
    const conversions = [
      (n: number) => n,
      (n: number) => BigNumberEthers.from(n),
      (n: number) => new BigNumberJs(n),
      (n: number) => new BN(n),
    ];
    for (const convertA of conversions) {
      for (const convertB of conversions) {
        for (const convertC of conversions) {
          test(convertA(a), convertB(b), convertC(c));
        }
      }
    }
  }

  describe('within', () => {
    it('.to.be.within', () => {
      checkAllWith3Args(100, 99, 101, (a, b, c) => expect(a).to.be.within(b, c));
    });

    it('.not.to.be.within', () => {
      checkAllWith3Args(100, 101, 102, (a, b, c) => expect(a).not.to.be.within(b, c));
      checkAllWith3Args(100, 98, 99, (a, b, c) => expect(a).not.to.be.within(b, c));
    });

    it('expect to throw on error', () => {
      expect(
        () => checkAllWith3Args(100, 80, 90, (a, b, c) => expect(a).to.be.within(b, c))
      ).to.throw(AssertionError, "expected 100 to be within 80..90");
      expect(
        () => checkAllWith3Args(100, 99, 101, (a, b, c) => expect(a).not.to.be.within(b, c))
      ).to.throw(AssertionError, "expected 100 to not be within 99..101");
    });
  });

  describe('closeTo', () => {
    it('.to.be.closeTo', () => {
      checkAllWith3Args(100, 101, 10, (a, b, c) => expect(a).to.be.closeTo(b, c));
    });

    it('.not.to.be.closeTo', () => {
      checkAllWith3Args(100, 111, 10, (a, b, c) => expect(a).to.not.be.closeTo(b, c));
    });

    it('expect to throw on error', () => {
      expect(
        () => checkAllWith3Args(100, 111, 10, (a, b, c) => expect(a).to.be.closeTo(b, c))
      ).to.throw(AssertionError, "expected 100 to be close to 111 +/- 10");
      expect(
        () => checkAllWith3Args(100, 101, 10, (a, b, c) => expect(a).not.to.be.closeTo(b, c))
      ).to.throw(AssertionError, "expected 100 not to be close to 101");
    });
  });
});
