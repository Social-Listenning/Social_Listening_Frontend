import { Upload } from 'antd';
import { read, utils } from 'xlsx';

export default function UploadFile(props) {
  const { getData, getHeader, moveToStep } = props;

  async function handleUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = read(e.target.result, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      getHeader(getHeaderRow(worksheet));
      // const sheetData = utils.sheet_to_json(worksheet);
      // getData(sheetData);
    };
    reader.readAsBinaryString(file);
    moveToStep((step) => step + 1);
    return false;
  }

  function getHeaderRow(worksheet) {
    const headers = [];
    const range = utils.decode_range(worksheet['!ref']);
    let C;
    const R = range.s.r;
    for (C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[utils.encode_cell({ c: C, r: R })];
      let hdr = `UNKNOWN ${C}`;
      if (cell && cell.t) hdr = utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }

  return (
    <Upload
      accept=".xlsx, .xls"
      className="pointer"
      showUploadList={false}
      beforeUpload={handleUpload}
    >
      {props.children}
    </Upload>
  );
}
