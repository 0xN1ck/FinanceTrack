import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import moment from "moment/moment";

const DetailsReportForm = ({isOpen, toggle, modalData}) => {
  const modalStyles = {
    modalItem: {
      display: "flex",
      marginBottom: "10px"
    },
    modalLabel: {
      fontWeight: "bold",
      marginRight: "5px"
    },
    modalValue: {
      flexGrow: 1
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Детали</ModalHeader>
      <ModalBody>
        {modalData && (
          <>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Пользователь:</span>
              <span style={modalStyles.modalValue}>{modalData.user.username}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Начальная дата:</span>
              <span style={modalStyles.modalValue}>
                {moment(modalData.date_start).locale("ru").format("D MMMM YYYY [г.]")}
              </span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Конечная дата:</span>
              <span style={modalStyles.modalValue}>
                {moment(modalData.date_end).locale("ru").format("D MMMM YYYY [г.]")}
              </span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Доход:</span>
              <span style={modalStyles.modalValue}>{modalData.income}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Расход:</span>
              <span style={modalStyles.modalValue}>{modalData.expense}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Долг:</span>
              <span style={modalStyles.modalValue}>{modalData.debt}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Сумма расходников:</span>
              <span style={modalStyles.modalValue}>{modalData.amount_of_consumables}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={modalStyles.modalLabel}>Комиссия за пополнения:</span>
              <span style={modalStyles.modalValue}>{modalData.amount_commission_for_deposits}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={{...modalStyles.modalLabel, color: modalData.total >= 0 ? '#78b33f' : '#ff3e3d', fontSize: '1.3em'}}>Итого:</span>
              <span style={{...modalStyles.modalValue, fontSize: '1.3em'}}>{modalData.total}</span>
            </div>
            <div style={modalStyles.modalItem}>
              <span style={{
                ...modalStyles.modalLabel,
                color: '#0092d2',
                fontSize: '1.3em'
              }}>Выплата:</span>
              <span style={{...modalStyles.modalValue, fontSize: '1.3em'}}>{modalData.payment}</span>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Закрыть
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DetailsReportForm;