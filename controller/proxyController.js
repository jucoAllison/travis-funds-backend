const axios = require('axios');
const https = require('https');

exports.getGraph = async (req, res) => {
  const payload = {...req.body};
  try {
    const reps = await axios.post(
      'https://api.backend.currency.com/proxy/trading/v1/quoteHistory',
      payload
    );

    const data = await reps;
    res
      .status(200)
      .json({msg: 'sucessfull', err: false, history: data.data.history});
  } catch (error) {
    // console.log(error);
    res.status(500).json({msg: 'error', err: true, error});
  }
};

// first etoro fetching
exports.firstFetching = async (req, res) => {
  try {
    const reps = await axios.get(
      'https://api.etorostatic.com/sapi/candles/closingprices.json?cv=8059f3deecc52c9c4206c8bfcb44aea0_8e358204e883b7e20907905b50be4cbc'
    );

    const data = await reps;
    const setting = data.data.map((v) => {
      return {...v};
    });
    res
      .status(200)
      .json({msg: 'sucessfull', err: false, data:  setting});
  } catch (error) {
    // console.log(error);
    res.status(500).json({msg: 'error', err: true, error});
  }
};

// second etoro fetching
exports.secondFetching = async (req, res) => {
  try {
    const reps = await axios.get(
      'https://api.etorostatic.com/sapi/trade-real/instruments/bulk-slim?InstrumentDataFilters=TradingData&bulkNumber=1&cv=ae3e8d1bcb259b9023cf4db8222d2507_55c553155832cdc527e883fbfb12cc94&totalBulks=1'
    );

    const data = await reps;
    const setting = data.data.Instruments.map((v) => {
      return {...v};
    });
    res
      .status(200)
      .json({msg: 'sucessfull', err: false, data: setting});
  } catch (error) {
    // console.log(error);
    res.status(500).json({msg: 'error', err: true, error});
  }
};

// third etoro fetching
exports.thirdFetching = async (req, res) => {
  try {
    const reps = await axios.get(
      'https://api.etorostatic.com/sapi/instrumentsmetadata/V1.1/instruments/bulk?bulkNumber=1&cv=24fc652f1a9f17170c8bcfd9ba096ca6_66aa0a3f9ed23332f3938b6161ef94c1&totalBulks=1'
    );

    const data = await reps;
    const setting = data.data.InstrumentDisplayDatas.map((v) => {
      return {...v};
    });
    res
      .status(200)
      .json({msg: 'sucessfull', err: false, data: setting});
  } catch (error) {
    // console.log(error);
    res.status(500).json({msg: 'error', err: true, error});
  }
};
