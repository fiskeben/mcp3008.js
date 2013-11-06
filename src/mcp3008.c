#include <stdint.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/spi/spidev.h>
#include "mcp3008.h"

#define ARRAY_SIZE(array) sizeof(array)/sizeof(array[0])

const char *device = "/dev/spidev0.0";
uint8_t mode = SPI_MODE_0;
uint8_t bits = 8;
uint32_t speed = 1000000;
uint16_t delay = 0;

int transfer(int fd, uint8_t tx[], uint8_t rx[]) {
    int ret;
    struct spi_ioc_transfer tr = {
        .tx_buf = (unsigned long)tx,
        .rx_buf = (unsigned long)rx,
        .len = ARRAY_SIZE(tx),
        .delay_usecs = delay,
        .speed_hz = speed,
        .bits_per_word = bits,
    };

    ret = ioctl(fd, SPI_IOC_MESSAGE(1), &tr);
    if (ret == 1) {
        fprintf(stderr, "Can't send API message");
        abort();
    }

    return ((rx[1] & 3) << 8) + rx[2];
}

int get_value() {
    int fd;
    int ret = 0;
    uint8_t wr_buf[] = {1, 128, 0};
    uint8_t rd_buf[3];
    
    fd = open(device, O_RDWR);
    if (fd<=0) { 
        fprintf(stderr, "Device %s not found\n", device);
        exit(1);
    }

    ret = transfer(fd, wr_buf, rd_buf);

    close(fd);
    return ret;
}
