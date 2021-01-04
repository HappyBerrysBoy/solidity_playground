// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

library ConvertLib {
    function convert(uint256 amount, uint256 conversionRate)
        public
        pure
        returns (uint256 convertedAmount)
    {
        return amount * conversionRate * 1 * 2;
    }

    function convert2(uint256 amount, uint256 conversionRate)
        public
        pure
        returns (uint256 convertedAmount)
    {
        return amount * conversionRate * 2 * 3;
    }

    function convert3(uint256 amount, uint256 conversionRate)
        public
        pure
        returns (uint256 convertedAmount)
    {
        return amount * conversionRate * 3 * 4;
    }
}
