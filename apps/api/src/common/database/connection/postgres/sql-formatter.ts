const parseColumnName = (text: string): string => {
    return text.replace(/([A-Z])/g, '_$1').toLowerCase();
}


export const sqlInsert = (q: { table: string, values: { [colunm: string]: any } | { [colunm: string]: any }[], returning?: string | string[] }): { sql: string, params?: any[] } => {

    let sql: string;
    let colunms: string = '';
    let values: string = '';
    let returning: string = q.returning ? ` RETURNING ${Array.isArray(q.returning) ? q.returning.join(', ') : q.returning}` : '';
    let params: any[] | undefined = undefined;


    if (Array.isArray(q.values)){
        let data:{ [colunm: string]: any }[] = q.values;
        params = [];
        colunms = Object.keys(q.values[0]).join(', ');

        values = data.reduce<string>(
            (accumulator, currentValue) => {
                return `${accumulator}, (${ Object.values(currentValue).reduce<string>((p, c) => `${p}, $${params?.push(c)}`, '').substring(2) })`;
            },
            ''
        ).substring(2);

    } else {
        params = [];
        Object.entries(q.values).filter(x => x[1] !== undefined).forEach(entry => {
            colunms += `, ${parseColumnName(entry[0])}`;
            values += `, $${params?.push(entry[1])}`;
        });
        colunms = colunms.substring(2);
        values = `(${values.substring(2)})`;
    }
    sql = `INSERT INTO ${q.table}(${colunms}) VALUES${values}${returning}`;

    return {
        sql,
        params
    }
}

export const sqlUpdate = (q: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[] }) => {

    let sql: string = "";
    let sets: string;
    let params: any[] = [];
    let condition: string;
    let returning: string = q.returning ? ` RETURNING ${Array.isArray(q.returning) ? q.returning.join(', ') : q.returning}` : '';

    sets = Object.entries(q.update).filter(x => x[1] !== undefined).reduce<string>((p, c) => `${p}, ${parseColumnName(c[0])} = $${params.push(c[1]) }`, '').substring(2);

    if (typeof q.condition == 'string'){
        condition = q.condition;
    } else {
        condition = q.condition[0];
        if (condition.match(/(=\?|= \?)/)){
            let tempoIndex: number = -1;
            condition = condition.replace(/(=\?|= \?)/g, (amches: string) => {
                tempoIndex++;
                return `= $${params.push(q.condition[1][tempoIndex])}`;
            });
        } else {
            condition = condition.replace(/\$\w/g, (maches: string) => {
                let index = Number.parseInt(maches.substring(1)) - 1;
                return `$${params.push(q.condition[1][index])}`;
            });
        }
    }
    
    sql = `UPDATE ${q.table} SET ${sets} WHERE ${condition}${returning}`;

    return {
        sql,
        params
    }
}

export const sqlDelete = (q: { table: string, condition: string | [string, any[]], returning?: string | string[] }) => {
    let returning: string = q.returning ? ` RETURNING ${Array.isArray(q.returning) ? q.returning.join(', ') : q.returning}` : '';
    let condition: string;
    let params: any[] | undefined = undefined;
    let sql: string;

    if (typeof q.condition == 'string'){
        condition = q.condition;
    } else {
        params = [];
        condition = q.condition[0];
        if (condition.match(/(=\?|= \?)/)){
            let tempoIndex: number = -1;
            condition = condition.replace(/(=\?|= \?)/g, (amches: string) => {
                tempoIndex++;
                return `= $${params?.push(q.condition[1][tempoIndex])}`;
            });
        } else {
            condition = condition.replace(/\$\w/g, (maches: string) => {
                let index = Number.parseInt(maches.substring(1)) - 1;
                return `$${params?.push(q.condition[1][index])}`;
            });
        }
    }

    sql = `DELETE FROM ${q.table} WHERE ${condition}    ${returning}`;

    return {
        sql,
        params
    }
}