
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js

importPackage(java.awt);
importPackage(java.awt.event);
importPackage(java.io);
importPackage(java.lang);
importPackage(java.util);
importPackage(javax.imageio);
importPackage(javax.swing);
importPackage(javax.swing.filechooser);
importPackage(com.github.sarxos.webcam);

/**
 * This class provides functions to control webcams
 * e.g for capturing pictures
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elojc
 */
sol.define("sol.common.jc.WebcamUtils", {

  singleton: true,

  userOptionSelectedIndex: "ELOjc.WebcamUtils.selectedIndex",

  dlgResult: {},

  /**
   * @private
   * Adjust Viewport of scrollPane
   * @param {javax.swing.JScrollPane} scrollPane
   * @param {java.awt.Dimension} webCamViewSize
   * @param {Object} cropImageDimension
   * @return {java.awt.Rectangle} Viewport Rectangle
   *
   */
  adjustViewport: function (scrollPane, webCamViewSize, cropImageDimension) {
    var me = this,
        w0, h0, w1, h1, vpRect, vp;

    w0 = webCamViewSize.getWidth();
    h0 = webCamViewSize.getHeight();
    w1 = cropImageDimension.width;
    h1 = cropImageDimension.height;
    vpRect = me.getViewportRectangle(w0, h0, w1, h1);
    vp = scrollPane.getViewport();
    vp.setViewPosition(new Point(0, 0));
    scrollPane.setBounds(10, 40, vpRect.width, vpRect.height);
    if (vpRect.height > vpRect.width) {
      scrollPane.setBounds(10, 40, vpRect.width, vpRect.height + 27);
      vp.setViewPosition(new Point(((w0 - scrollPane.getWidth()) / 2), 0));
    }
    if (vpRect.height < vpRect.width) {
      scrollPane.setBounds(10, 40, vpRect.width + 27, vpRect.height);
      vp.setViewPosition(new Point(0, ((h0 - scrollPane.getHeight() + 13) / 2)));
    }
    if (vpRect.height == vpRect.width) {
      scrollPane.setBounds(10, 40, vpRect.width, vpRect.height + 27);
      vp.setViewPosition(new Point(((w0 - scrollPane.getWidth()) / 2), 0));
    }
    return vpRect;
  },

   /**
   * @private
   * Get Viewport Rectangle
   * @param {Number} w0
   * @param {Number} h0
   * @param {Number} w1
   * @param {Number} h1
   * @return {java.awt.Rectangle} Viewport Rectangle
   */
  getViewportRectangle: function (w0, h0, w1, h1) {
    var x, y, w, h,
        scalex, scaley, rectangle;

    w0 = parseFloat(w0);
    h0 = parseFloat(h0);
    w1 = parseFloat(w1);
    h1 = parseFloat(h1);

    while ((h1 > h0) || (w1 > w0)) {
      h1 /= 2;
      w1 /= 2;
    }

    x = (w0 - w1) / 2;
    y = (h0 - h1) / 2;
    w = w1;
    h = h1;

    scalex = w1 / w0;
    scaley = h1 / h0;

    if (scalex < scaley) {
      x *= (scalex / 2);
      y = 0;
      h = h0;
      w = (w1 / h1 * h0);
    }

    if (scalex > scaley) {
      y *= (scaley / 2);
      x = 0;
      w = w0;
      h = (h1 / w1 * w0);
    }

    if (scalex == scaley) {
      y = 0;
      x = 0;
      w = w0;
      h = h0;
    }
    rectangle = new Rectangle(x, y, w, h);
    return rectangle;
  },

  /**
   * Shows a webcam and get captured image
   */
  getImage: function () {
    var me = this,
        dlgWebcam, panel, scrollPane, okButton, cancelButton,
        webCamPanel, vp, acl, wc, webCamsIterator, wnames, i, maxIndex,
        webCam, webCams, selectedIndex, imageCaptured,
        cboWnames, vpRect, offsetX, offsetY, diff, cropImageDimension, webCamViewSize;
// TODO aus config auslesen
    cropImageDimension = cropImageDimension || {
      width: "300",
      height: "300"
    };
// TODO aus config auslesen
    wc = Webcam.getDefault();
    if (wc) {
      // get all webcams
      webCams = [];
      webCamsIterator = wc.getWebcams().iterator();
      while (webCamsIterator.hasNext()) {
        webCams.push(webCamsIterator.next());
      }
      // get webcam names
      wnames = [];
      for (i = 0; i < webCams.length; i++) {
        wnames.push(webCams[i].getName());
      }
      // build dialog
      if (webCams.length > 0) {
        selectedIndex = Number(archive.getUserOption(me.userOptionSelectedIndex, "5"));
        maxIndex = webCams.length - 1;
        if (selectedIndex > maxIndex) {
          selectedIndex = maxIndex;
          archive.setUserOption(me.userOptionSelectedIndex, maxIndex);
        }
        try {
          webCam = webCams[selectedIndex];
          webCam.close();
          // show image
          webCamViewSize = WebcamResolution.VGA.getSize();
          webCam.setViewSize(webCamViewSize);
          webCamPanel = new WebcamPanel(webCam);
          webCamPanel.setImageSizeDisplayed(true);
        } catch (e) {
        }
        panel = new JPanel();
        panel.add(webCamPanel);
        scrollPane = new JScrollPane (panel,
            ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED,
            ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
        vpRect = me.adjustViewport(scrollPane, webCamViewSize, cropImageDimension);

        dlgWebcam = new JDialog(new Frame(), true);
        dlgWebcam.setResizable(false);
        dlgWebcam.setModal(true);
        dlgWebcam.setTitle(me.getText("sol.common.client.jc.webcamUtils.dialog.webcamTitle"));
        dlgWebcam.setLayout(null);

        dlgWebcam.add(scrollPane);

        acl = new JavaAdapter(ActionListener, {
          actionPerformed: function (ae) {
            if (ae.getSource() == okButton) {
              // get image
              imageCaptured = webCam.getImage();
              vp = scrollPane.getViewport();
              vpRect = vp.getViewRect();

              diff = vpRect.x + vpRect.width - webCamViewSize.getWidth();
              if (diff > 0) {
                vpRect = new Rectangle(vpRect.x, vpRect.y, vpRect.width - diff, vpRect.height);
              }
              diff = vpRect.y + vpRect.height - webCamViewSize.getHeight();
              if (diff > 0) {
                vpRect = new Rectangle(vpRect.x, vpRect.y, vpRect.width, vpRect.height - diff);
              }
              // webcam release
              webCam.close();
              dlgWebcam.setModal(false);
              dlgWebcam.dispose();
              me.dlgResult = { result: "OK", capturedImage: imageCaptured, viewRect: vpRect };
              return;
            }
            if (ae.getSource() == cancelButton) {
              webCam.close();
              dlgWebcam.setModal(false);
              dlgWebcam.dispose();
              me.dlgResult = { result: "Cancel" };
              return;
            }
            if (ae.getSource() == cboWnames) {
              try {
                selectedIndex = cboWnames.getSelectedIndex();
                webCam = webCams[selectedIndex];
                archive.setUserOption(me.userOptionSelectedIndex, selectedIndex);
                webCam.close();
                // show image
                webCamViewSize = WebcamResolution.VGA.getSize();
                webCam.setViewSize(webCamViewSize);
                webCamPanel = new WebcamPanel(webCam);
                webCamPanel.setImageSizeDisplayed(true);
                // update panel with selected webcam
                panel.removeAll();
                panel.add(webCamPanel);
                vpRect = me.adjustViewport(scrollPane, webCamViewSize, cropImageDimension);
              } catch (e) {
                me.dlgResult = { result: "Exception", message: e.message };
              }
              return;
            }
          }
        });

        cboWnames = new JComboBox(wnames);
        cboWnames.setBounds (10, 10, scrollPane.getWidth(), 20);
        cboWnames.setSelectedIndex(selectedIndex);
        cboWnames.addActionListener(acl);
        dlgWebcam.add(cboWnames);

        offsetX = scrollPane.getX() + scrollPane.getWidth();
        offsetY = scrollPane.getY() + scrollPane.getHeight() + 10;

        okButton = new JButton (me.getText("sol.common.client.jc.webcamUtils.dialog.btnOk"));
        okButton.setBounds (offsetX - 210, offsetY, 100, 20);
        okButton.addActionListener(acl);
        dlgWebcam.add(okButton);

        cancelButton = new JButton (me.getText("sol.common.client.jc.webcamUtils.dialog.btnCancel"));
        cancelButton.setBounds (offsetX - 100, offsetY, 100, 20);
        cancelButton.addActionListener(acl);
        dlgWebcam.add(cancelButton);

        dlgWebcam.setSize(10 + scrollPane.getWidth() + 30, offsetY + 70);
        dlgWebcam.setVisible(true);
        return;
      }
    } else {
      workspace.showInfoBox("ELO", me.getText("sol.common.client.jc.webcamUtils.msg.noWebcam"));
      return;
    }

  },

  /**
   * @private
   * Save image as jpg file
   * @param {java.awt.image.BufferedImage} image image
   * @param {String} path path
   * @return {Boolean}
   */
  saveImageAsJpg: function (image, path) {
    var me = this,
        chooser, file, imageFilter, result;

    if (path == null) {
      path = System.getProperty("user.home");
    }
    file = new File(path.trim());
    chooser = new JFileChooser(path);
    chooser.setDialogType(JFileChooser.SAVE_DIALOG);
    imageFilter = new FileNameExtensionFilter("Image: jpg", "jpg");
    chooser.removeChoosableFileFilter(chooser.getAcceptAllFileFilter());
    chooser.setFileFilter(imageFilter);
    chooser.setDialogTitle(me.getText("sol.common.client.jc.webcamUtils.chooser.saveTitle"));
    chooser.setVisible(true);
    result = chooser.showSaveDialog(null);
    if (result == JFileChooser.APPROVE_OPTION) {
      path = chooser.getSelectedFile().toString();
      file = new File(path);
      if (imageFilter.accept(file)) {
        ImageIO.write(image, "JPG", file);
        workspace.showInfoBox("ELO", path + " " + me.getText("sol.common.client.jc.webcamUtils.msg.isSaved"));
      } else {
        path += ".jpg";
        file = new File(path);
        ImageIO.write(image, "JPG", file);
        workspace.showInfoBox("ELO", path + " " + me.getText("sol.common.client.jc.webcamUtils.msg.isSaved"));
      }
      chooser.setVisible(false);
      return true;
    }
    chooser.setVisible(false);
    return false;
  },

  /**
   * @private
   * Get cropped image
   * @param {java.awt.image.BufferedImage} image image
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @return{java.awt.image.BufferedImage} cropped image
   */
  cropImage: function (image, x, y, w, h) {
    return image.getSubimage(x, y, w, h);
  },

  /**
   * @private
   * Convert image to base64
   * @param {java.awt.image.BufferedImage} image image
   * @param {String} type image type, e.g "JPG"
   * @return {String} converted Base64 String
   */
  convertImageToBase64String: function (image, type) {
    var imageString, bos, imageBytes, encoder;

    imageString = null;
    bos = new java.io.ByteArrayOutputStream();
    try {
      ImageIO.write(image, type, bos);
      imageBytes = bos.toByteArray();

      encoder = Base64.getEncoder();
      imageString = encoder.encodeToString(imageBytes);
      bos.close();
    } catch (e) {
    }
    return imageString;
  },

  /**
   * @private
   * Convert image to base64
   * @param {String} imageString base64 String
   * @return {java.awt.image.BufferedImage} image image
   */
  convertBase64StringToImage: function (imageString) {
    var image, bis, imageBytes, decoder;

    image = null;
    try {
      decoder = Base64.getDecoder();
      imageBytes = decoder.decode(imageString);
      bis = new ByteArrayInputStream(imageBytes);
      image = ImageIO.read(bis);
      bis.close();
    } catch (e) {
    }
    return image;
  },

  /**
   * @private
   * Show image
   * @param {java.awt.image.BufferedImage} image image
   */
  showImage: function (image) {
    var me = this,
        dlg, imagePanel, imageLabel;

    try {
      dlg = workspace.createGridDialog(me.getText("sol.common.client.jc.webcamUtils.dialog.imageTitle"), 1, 1);
      imagePanel = new JPanel();
      imageLabel = new JLabel(new ImageIcon(image));
      imagePanel.add(imageLabel);
      dlg.gridPanel.setGrowing([1], [1]);
      dlg.gridPanel.addComponent(1, 1, 1, 1, imagePanel);
      dlg.show();
    } catch (e) {
    }
  },

  /**
   * @private
   * show base64
   * @param {String} base64 base64
   */
  showBase64String: function (base64) {
    var me = this,
        dlg, ta;

    dlg = workspace.createGridDialog(me.getText("sol.common.client.jc.webcamUtils.dialog.base64Title"), 1, 1);
    dlg.gridPanel.setGrowing([1], [1]);
    ta = dlg.gridPanel.addTextArea(1, 1, 1, 1);
    ta.setText(base64);
    ta.setEditable(false);
    dlg.show();
  },

  /**
   * Helper function that returns localized text constants
   * @param {String} key Key of the text constants
   * @return {String} Localized text constant
   */
  getText: function (key) {
    return utils.getText("sol.common", key);
  }

});

// Receive Message from ELOwf Formular
function eloReceiveBrowserMessage(msg, compName, browserComponent) {
  var respObject, browserComp, image, strBase64,
      dlgResult, capturedImage, viewRect,
      result;

  browserComp = browserComponent;
  if (msg.name == "sol.common.jc.WebcamUtils.getImage") {
    strBase64 = null;
    cropImageDimension = msg.data.cropImageDimension;
    sol.common.jc.WebcamUtils.getImage();
    dlgResult = sol.common.jc.WebcamUtils.dlgResult;
    if (dlgResult) {
      if (dlgResult.result == "OK") {
        capturedImage = dlgResult.capturedImage;
        viewRect = dlgResult.viewRect;
        image = sol.common.jc.WebcamUtils.cropImage(capturedImage, viewRect.x, viewRect.y, viewRect.width, viewRect.height);
        strBase64 = String(sol.common.jc.WebcamUtils.convertImageToBase64String(image, "jpg"));
      }
    } /*
    if (strBase64) {
    try {
        result = sol.common.IxUtils.execute("RF_sol_dev_service_UploadPhoto", {
          visitorObjId: msg.data.objId,
          base64Content: strBase64
        });
        if (result.objId) {
          workspace.gotoId(parseInt(result.objId));
        }
      } catch (e) {
        workspace.showAlertBox("ELO", sol.common.jc.WebcamUtils.getText("sol.common.client.jc.webcamUtils.error.saveImage") + " " + e.message);
      }


    } else {
      workspace.showInfoBox("ELO", sol.common.jc.WebcamUtils.getText("sol.common.client.jc.webcamUtils.msg.noImageCaptured"));
    }*/
    respObject = { response: strBase64 };
    browserComp.sendCustomResponse(msg, respObject);
  }
}