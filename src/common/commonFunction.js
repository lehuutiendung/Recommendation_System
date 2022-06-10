import moment from "moment"

class CommonFunction {
    getDayOfTimeWithDay(fromDate, toDate){
        let m1 = moment(fromDate);
        let m2 = moment(toDate);
        return m2.diff(m1, "days");
    }

    getDayOfTimeWithHour(fromDate, toDate){
        let m1 = moment(fromDate);
        let m2 = moment(toDate);
        return m2.diff(m1, "hours");
    }

    getDayOfTimeWithMinutes(fromDate, toDate){
        let m1 = moment(fromDate);
        let m2 = moment(toDate);
        return m2.diff(m1, "minutes");
    }

    getDayOfTimeWithSecond(fromDate, toDate){
        let m1 = moment(fromDate);
        let m2 = moment(toDate);
        return m2.diff(m1, "seconds");
    }
}
export default new CommonFunction();