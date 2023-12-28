import axios from "axios";

export function getWorkNameTable() {
    const path = 'http://127.0.0.1:6325/tooling_process/work_procedure/get';
    return axios.get(path)
        .then((res) => {
            return res.data.data;
        })
}

export function searchReportedData(workNumber, workProcedure) {
    const path = 'http://127.0.0.1:6325/tooling_process/reported/search';
    const params = {
        work_number: workNumber,
        work_procedure: workProcedure,
    };

    return axios.get(path, { params })
        .then((res) => {
            const data = res.data.data;
            return data;
        });
}


