/**
 * Barcode utilities
 *
 * @eloas
 *
 * @version 1.0
 * @author MW, ELO Digital Office GmbH
 *
 */
sol.define("sol.common.as.BarcodeUtils", {

  singleton: true,

  /**
   * Generates a barcode
   * @param {String} type Barcode type. Supported types: QR_CODE, CODE_39, ITF
   * @param {String} content Content
   * @param {String} config Configuration
   * @param {Number} config.width Image width
   * @param {Number} config.height Image height
   * @param {String} config.filePath Path of the destination file
   * @param {Boolean} config.returnBase64 If true the function returns the barcode as Base64 encoded string
   * @return {Object}
   *
   * # Example
   *
   *     base64String = sol.common.as.BarcodeUtils.generate("CODE_39", "12345678", { width: 200, height: 50, returnBase64: true });
   *
   */
  generate: function (type, content, config) {
    if (!content) {
      throw "Barcode content is empty.";
    }
    if (!type) {
      throw "Barcode type is empty.";
    }
    config = config || {};
    config.width = config.width || 500;
    var me = this,
        bitMatrix;
    switch (String(type).toUpperCase()) {
      case "QR_CODE":
        bitMatrix = me.createQrCode(content, config);
        break;
      case "CODE_39":
        bitMatrix = me.createCode39(content, config);
        break;
      case "ITF":
        bitMatrix = me.createItfCode(content, config);
        break;
      default:
        throw "Barcode type '" + type + "' is not supported.";
    }
    return me.createOutput(bitMatrix, config);
  },

  /**
   * @private
   * Creates a QR code
   * @param {String} content Content
   * @param {Object} config Configuration
   * @return {com.google.zxing.common.BitMatrix}
   */
  createQrCode: function (content, config) {
    var hintMap = new java.util.Hashtable(),
        qrCodeWriter = new com.google.zxing.qrcode.QRCodeWriter();
    config.height = config.height || config.width;
    hintMap.put(com.google.zxing.EncodeHintType.ERROR_CORRECTION, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.L);
    return qrCodeWriter.encode(content, com.google.zxing.BarcodeFormat.QR_CODE, config.width, config.height, hintMap);
  },

  /**
   * @private
   * Creates a Code 39 barcode
   * @param {String} content Content
   * @param {Object} config Configuration
   * @return {com.google.zxing.common.BitMatrix}
   */
  createCode39: function (content, config) {
    var hintMap = new java.util.Hashtable(),
        code39Writer = new com.google.zxing.oned.Code39Writer();

    config.height = config.height || (config.width / 3);
    content = String(content).toUpperCase();
    return code39Writer.encode(content, com.google.zxing.BarcodeFormat.CODE_39, config.width, config.height, hintMap);
  },

  /**
   * @private
   * Creates a Code ITF barcode (Interleaved 5 of 2)
   * @param {String} content Content
   * @param {Object} config Configuration
   * @return {com.google.zxing.common.BitMatrix}
   */
  createItfCode: function (content, config) {
    var hintMap = new java.util.Hashtable(),
        itfWriter = new com.google.zxing.oned.ITFWriter();
    config.height = config.height || (config.width / 3);
    return itfWriter.encode(content, com.google.zxing.BarcodeFormat.ITF, config.width, config.height, hintMap);
  },

  /**
   * @private
   * Produces the barcode output
   * @param {com.google.zxing.common.BitMatrix} bitMatrix
   * @param {Object} config Configuration
   * @return {String}
   */
  createOutput: function (bitMatrix, config) {
    var me = this,
        result, byteArrayOutputStream, file;
    config = config || {};

    if (config.filePath) {
      file = new File(config.filePath);
      config.fileType = config.fileType || sol.common.FileUtils.getExtension(file);
      Packages.com.google.zxing.client.j2se.MatrixToImageWriter.writeToPath(bitMatrix, config.fileType, file.toPath());
      if (config.show) {
        sol.common.ExecUtils.open(config.filePath);
      }
    }
    if (config.returnBase64) {
      byteArrayOutputStream = new java.io.ByteArrayOutputStream();
      Packages.com.google.zxing.client.j2se.MatrixToImageWriter.writeToStream(bitMatrix, "png", byteArrayOutputStream);
      result = me.convertByteArrayToBase64(byteArrayOutputStream.toByteArray());
      byteArrayOutputStream.close();
    }
    return result;
  },

  /**
   * @private
   * Converts a byte array to a Base64 encoded string
   * @param {java.lang.Byte[]} byteArray
   * @return {String} Base 64 encoded string
   */
  convertByteArrayToBase64: function (byteArray) {
    return String(new java.lang.String(org.apache.commons.codec.binary.Base64.encodeBase64(byteArray), "UTF-8"));
  }
});
