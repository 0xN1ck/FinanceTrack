FROM nginx:alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /user/share/nginx/html/FinanceTrack/

COPY ./finance_track_backend/ /user/share/nginx/html/FinanceTrack/finance_track_backend/
